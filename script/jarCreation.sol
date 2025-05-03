// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {jarCreation} from "../src/jarCreation.sol";

contract CounterScript is Script {
    jarCreation public counter;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        counter = new jarCreation();

        vm.stopBroadcast();
    }
}
