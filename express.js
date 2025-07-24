// Express.js API to interact with your Solidity contract using ethers.js

const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your deployed contract address and ABI
const CONTRACT_ADDRESS = '0x8464135c8F25Da09e49BC8782676a84730C318bC';
const CONTRACT_ABI = [
{"type":"function","name":"claimJarsRefund","inputs":[{"name":"_jarId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"createJar","inputs":[{"name":"_name","type":"string","internalType":"string"},{"name":"_cause","type":"string","internalType":"string"},{"name":"_targetAmount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"dismissJar","inputs":[{"name":"_jarId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"donateToJar","inputs":[{"name":"_jarId","type":"uint256","internalType":"uint256"},{"name":"_amountDeposited","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"donatedAmount","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"donations","inputs":[{"name":"","type":"uint256","internalType":"uint256"},{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getDepositDetails","inputs":[{"name":"_jarId","type":"uint256","internalType":"uint256"},{"name":"_donor","type":"address","internalType":"address"}],"outputs":[{"name":"donated","type":"uint256","internalType":"uint256"},{"name":"createdAmount","type":"uint256","internalType":"uint256"},{"name":"withdrawnAmount","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getJarCount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getJarCreator","inputs":[{"name":"_jarId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"getJarCurrentAmount","inputs":[{"name":"_jarId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getJarDetails","inputs":[{"name":"_jarId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"name","type":"string","internalType":"string"},{"name":"creator","type":"address","internalType":"address"},{"name":"cause","type":"string","internalType":"string"},{"name":"targetAmount","type":"uint256","internalType":"uint256"},{"name":"currentAmount","type":"uint256","internalType":"uint256"},{"name":"isWithdrawn","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"jarCreatedAmount","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"jarWithdrawnAmount","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"jars","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"name","type":"string","internalType":"string"},{"name":"creator","type":"address","internalType":"address payable"},{"name":"cause","type":"string","internalType":"string"},{"name":"targetAmount","type":"uint256","internalType":"uint256"},{"name":"currentAmount","type":"uint256","internalType":"uint256"},{"name":"beforeAmount","type":"uint256","internalType":"uint256"},{"name":"isWithdrawn","type":"bool","internalType":"bool"},{"name":"isDismissed","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"withdrawJarAmount","inputs":[{"name":"_jarId","type":"uint256","internalType":"uint256"},{"name":"_withdrawnAmount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"claimJarRefund","inputs":[{"name":"jarId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"donor","type":"address","indexed":false,"internalType":"address"},{"name":"cause","type":"string","indexed":false,"internalType":"string"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"fundDeposited","inputs":[{"name":"jarId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"donor","type":"address","indexed":false,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"fundRefunded","inputs":[{"name":"jarId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"donor","type":"address","indexed":false,"internalType":"address"},{"name":"recipient","type":"address","indexed":false,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"fundWithdrawn","inputs":[{"name":"jarId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"creator","type":"address","indexed":false,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"jarCreated","inputs":[{"name":"jarId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"name","type":"string","indexed":false,"internalType":"string"},{"name":"creator","type":"address","indexed":false,"internalType":"address"},{"name":"cause","type":"string","indexed":false,"internalType":"string"},{"name":"targetAmount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"jarDismissed","inputs":[{"name":"jarId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"creator","type":"address","indexed":false,"internalType":"address"},{"name":"cause","type":"string","indexed":false,"internalType":"string"}],"anonymous":false},{"type":"event","name":"jarTargetCompleted","inputs":[{"name":"jarId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"cause","type":"string","indexed":false,"internalType":"string"}],"anonymous":false},{"type":"event","name":"refundClaimed","inputs":[{"name":"jarId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"donor","type":"address","indexed":false,"internalType":"address"},{"name":"cause","type":"string","indexed":false,"internalType":"string"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"depositFailed","inputs":[{"name":"message","type":"string","internalType":"string"}]},{"type":"error","name":"jarAlreadyWithdrawn","inputs":[{"name":"message","type":"string","internalType":"string"}]},{"type":"error","name":"jarDoesNotExist","inputs":[{"name":"message","type":"string","internalType":"string"}]},{"type":"error","name":"withdrawFailed","inputs":[{"name":"message","type":"string","internalType":"string"}]}
];

// Set up provider and signer (use a private key with testnet ETH for development)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");// e.g., Infura/Alchemy RPC URL
const signer = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

// API: Create a new Jar
app.post('/api/jars', async (req, res) => {
  try {
    const { name, cause, targetAmount } = req.body;
    const tx = await contract.createJar(name, cause, targetAmount);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get total number of jars
app.get('/api/jars/count', async (req, res) => {
  try {
    const count = await contract.getJarCount();
    res.json({ count: Number(count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get details of a specific jar
app.get('/api/jars/:id', async (req, res) => {
  try {
    const jarId = req.params.id;
    const details = await contract.getJarDetails(jarId);
    res.json({
      name: details[0],
      creator: details[1],
      cause: details[2],
      targetAmount: details[3].toString(),
      currentAmount: details[4].toString(),
      isWithdrawn: details[5]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Donate to a jar
app.post('/api/jars/:id/donate', async (req, res) => {
  try {
    const jarId = req.params.id;
    const { amount } = req.body;
    const tx = await contract.donateToJar(jarId, amount, { value: amount });
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Withdraw from a jar
app.post('/api/jars/:id/withdraw', async (req, res) => {
  try {
    const jarId = req.params.id;
    const { amount } = req.body;
    const tx = await contract.withdrawJarAmount(jarId, amount);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Dismiss a jar
app.post('/api/jars/:id/dismiss', async (req, res) => {
  try {
    const jarId = req.params.id;
    const tx = await contract.dismissJar(jarId);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Claim refund from a dismissed jar
app.post('/api/jars/:id/claim-refund', async (req, res) => {
  try {
    const jarId = req.params.id;
    const tx = await contract.claimJarsRefund(jarId);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Contract API server running on port ${PORT}`);
});