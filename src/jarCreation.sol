// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

//import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract jarCreation {
    struct Jar {
        string name;
        address payable creator;
        string cause;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 beforeAmount;
        bool isWithdrawn;
        bool isDismissed;
    }

    mapping(uint256 => mapping(address => uint256)) public donations;
    Jar[] public jars;

    mapping(address => uint256) public donatedAmount;
    mapping(address => uint256) public jarCreatedAmount;
    mapping(address => uint256) public jarWithdrawnAmount;

    event jarCreated(uint256 jarId, string name, address creator, string cause, uint256 targetAmount);
    event fundWithdrawn(uint256 jarId, address creator, uint256 amount);
    event fundDeposited(uint256 jarId, address donor, uint256 amount);
    event fundRefunded(uint256 jarId, address donor, address recipient, uint256 amount);
    event jarTargetCompleted(uint256 jarId, uint256 amount, string cause);
    event jarDismissed(uint256 jarId, address creator, string cause);
    event claimJarRefund(uint256 jarId, address donor, string cause, uint256 amount);
    event refundClaimed(uint256 jarId, address donor, string cause, uint256 amount);

    error depositFailed(string message);
    error withdrawFailed(string message);
    error jarAlreadyWithdrawn(string message);
    error jarDoesNotExist(string message);

    function createJar(string memory _name, string calldata _cause, uint256 _targetAmount) public {
        require(_targetAmount > 0, "target amount must be greater than 0");

        Jar memory newJar = Jar({
            name: _name,
            creator: payable(msg.sender),
            cause: _cause,
            targetAmount: _targetAmount,
            currentAmount: 0,
            beforeAmount: 0,
            isWithdrawn: false,
            isDismissed: false
        });

        jars.push(newJar);
        emit jarCreated(jars.length - 1, _name, msg.sender, _cause, _targetAmount);
    }

    function donateToJar(uint256 _jarId, uint256 _amountDeposited) public payable {
        require(_jarId < jars.length, "jar does not exist");
        require(_amountDeposited > 0, "donation must be greater than 0");

        Jar storage jar = jars[_jarId];

        require(!jar.isWithdrawn, "jar has been withdrawn");
        require(!jar.isDismissed, "Jar has been dismissed by creator");
        require(jar.currentAmount < jar.targetAmount, "Donation goal already reached");
        require(_amountDeposited <= (jar.targetAmount - jar.currentAmount), "Donation exceeds required amount");

        donations[_jarId][msg.sender] += _amountDeposited;
        jar.beforeAmount = jar.currentAmount;
        jar.currentAmount += _amountDeposited;

        if (jar.currentAmount >= jar.targetAmount) {
            emit jarTargetCompleted(_jarId, jar.currentAmount, jar.cause);
        }

        emit fundDeposited(_jarId, msg.sender, _amountDeposited);
    }

    function withdrawJarAmount(uint256 _jarId, uint256 _withdrawnAmount) public {
        require(_jarId < jars.length, "Jar does not exist");
        require(_withdrawnAmount > 0, "Withdrawn amount must be greater than 0");

        Jar storage jar = jars[_jarId];

        require(jar.creator == msg.sender, "Only creator can withdraw");
        require(jar.currentAmount >= _withdrawnAmount, "Insufficient funds in jar");
        require(!jar.isWithdrawn, "Already withdrawn");

        jar.currentAmount -= _withdrawnAmount;
        jar.isWithdrawn = true;

        (bool sent, ) = jar.creator.call{value: _withdrawnAmount}("");
        require(sent, "ETH Transfer failed");

        emit fundWithdrawn(_jarId, jar.creator, _withdrawnAmount);
    }

    function getJarCount() public view returns (uint256) {
        return jars.length;
    }

    function getJarDetails(uint256 _jarId) public view returns (
        string memory name,
        address creator,
        string memory cause,
        uint256 targetAmount,
        uint256 currentAmount,
        bool isWithdrawn
    ) {
        require(_jarId < jars.length, "jar does not exist");
        Jar memory jar = jars[_jarId];
        return (jar.name, jar.creator, jar.cause, jar.targetAmount, jar.currentAmount, jar.isWithdrawn);
    }

    function getDepositDetails(uint256 _jarId, address _donor) public view returns (
        uint256 donated,
        uint256 createdAmount,
        uint256 withdrawnAmount
    ) {
        require(_jarId < jars.length, "jar does not exist");
        return (donations[_jarId][_donor], jarCreatedAmount[_donor], jarWithdrawnAmount[_donor]);
    }

    function getJarCreator(uint256 _jarId) public view returns (address) {
        require(_jarId < jars.length, "jar does not exist");
        return jars[_jarId].creator;
    }

    function getJarCurrentAmount(uint _jarId) public view returns (uint256) {
        if (_jarId < jars.length) {
            return jars[_jarId].currentAmount;
        } else {
            revert jarDoesNotExist("jar does not exist");
        }
    }

    function dismissJar(uint256 _jarId) public {
        require(_jarId < jars.length, "jar does not exist");
        Jar storage jar = jars[_jarId];

        require(msg.sender == jar.creator, "only creator can dismiss jar");
        require(!jar.isWithdrawn, "jar already withdrawn");

        jar.isDismissed = true;
        emit jarDismissed(_jarId, msg.sender, jar.cause);
    }

    function claimJarsRefund(uint256 _jarId) public {
        require(_jarId < jars.length, "jar does not exist");
        Jar storage jar = jars[_jarId];

        require(jar.isDismissed, "jar is not dismissed");
        require(!jar.isWithdrawn, "jar already withdrawn");
        require(donations[_jarId][msg.sender] > 0, "no donations to claim");

        uint256 refundAmount = donations[_jarId][msg.sender];
        donations[_jarId][msg.sender] = 0;

        (bool sent, ) = msg.sender.call{value: refundAmount}("");
        require(sent, "ETH transfer failed");

        emit refundClaimed(_jarId, msg.sender, jar.cause, refundAmount);
    }
}