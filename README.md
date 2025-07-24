# 📘 EventCreation Smart Contract

## 🧩 Introduction

**EventCreation**, originally designed as `JarCreation`, is a decentralized fundraising smart contract built on the **Ethereum blockchain** using **Solidity**. It enables individuals, communities, and organizations to raise funds transparently by creating digital **"Jars"**—virtual donation pools with specific goals or causes.

> 💡 In this context, an "Event" refers to a "Jar"—a fundraising instance for a specific purpose.

---

## 🌟 Why It Matters

In today’s digital world, crowdfunding faces challenges like **trust issues**, **fund misuse**, and **lack of transparency**. `EventCreation` solves this through blockchain, ensuring every transaction is:

- 🔒 Transparent
- ⚙️ Automated
- 🧾 Auditable

### ✅ Real-World Use Cases

- 🏥 **Medical Emergencies** – Surgery, treatment, urgent care
- 🌍 **Community Support** – NGOs, education, relief funds
- 🎉 **Event Fundraising** – College fests, hackathons, drives
- 🚀 **Personal Goals** – Learning, travel, creative ventures

Plus, **donors can reclaim their funds** if a campaign is dismissed before completion.

---

## 🔐 Key Features

| Feature | Description |
|--------|-------------|
| 🎯 **Create Jars** | Launch a fundraising campaign with a name, cause, and target. |
| 💸 **Donate ETH** | Contribute ETH directly to any jar. |
| 🏧 **Withdraw Funds** | If the goal is reached, the creator can withdraw the ETH. |
| ❌ **Dismiss Jars** | Creators can cancel their jars before reaching the goal. |
| 💰 **Claim Refunds** | Donors can reclaim ETH from dismissed jars. |
| 📡 **On-Chain Transparency** | All events are visible on blockchain explorers. |

---

## 🧠 Smart Contract Structure

Each **Jar** is a `struct` containing:

- Jar ID
- Name & Cause
- Creator address
- Target & current amount
- Status: withdrawn or dismissed

### 🧾 Tracking:

- Uses `mappings` to track donor contributions per jar.
- Access control ensures only the creator can withdraw/dismiss.
- Prevents:
  - Overfunding
  - Multiple withdrawals
  - Donations to dismissed jars

---

## 📢 Events & Error Handling

**Events:**
- `JarCreated`
- `FundDeposited`
- `FundWithdrawn`
- `JarDismissed`
- `RefundClaimed`

**Custom Errors:**
- `JarDoesNotExist`
- `NotAuthorized`
- `WithdrawFailed`
- `AlreadyWithdrawn`

These improve debugging and help off-chain UIs monitor updates.

---

## 🌍 Real-Life Example

> Imagine a family needs ₹3,00,000 for emergency surgery.  
They create a jar on-chain.  
Friends and donors contribute ETH using MetaMask.  
Once the goal is met, the family withdraws the funds instantly.  
If the campaign is canceled, all donors get their ETH back.  
**No middlemen. No bank delays. Just trustless fundraising.**

---

## 🔧 Function Overview

| Function | Purpose |
|----------|---------|
| `createJar(string _name, string _cause, uint256 _targetAmount)` | Starts a new jar |
| `donateToJar(uint256 _jarId)` | Donate ETH to a jar |
| `withdrawJarAmount(uint256 _jarId, uint256 _withdrawnAmount)` | Creator withdraws ETH |
| `getJarCount()` | Returns total number of jars |
| `getJarDetails(uint256 _jarId)` | Fetch jar details |
| `getDepositDetails(uint256 _jarId, address _donor)` | View donor contribution |
| `getJarCreator(uint256 _jarId)` | Get jar creator’s address |
| `getJarCurrentAmount(uint256 _jarId)` | ETH collected so far |
| `dismissJar(uint256 _jarId)` | Cancel a jar campaign |
| `claimJarsRefund(uint256 _jarId)` | Donor claims refund |

---

## 💻 Tech Stack

- 🧠 Solidity
- 🧪 Hardhat / Foundry
- 🔌 Ethers.js
- 🦊 MetaMask
- 🧾 Sepolia / Anvil (testnets)
- 🌕Ether,js
- 🌐React.js
- ⛩️Html
- 🏯CSS

---

## 🤝 Contribute

Want to improve this contract or build a dApp on top of it?  
Feel free to use, fork, and contribute with attribution.
MIT License.  

---

## 🔗 Connect

Built with 💙 by [Shivansh Nigam](https://github.com/shubu258)

