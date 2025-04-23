# Taiko Ecosystem Wallet SDK

A TypeScript SDK for interacting with the Taiko blockchain, built on top of ethers.js and including Shield protection features.

## Installation

```bash
npm install taiko-ecosystem-wallet
```

## Usage

```typescript
import TaikoWallet from 'taiko-ecosystem-wallet';
import { ethers } from 'ethers';

// Initialize the wallet
const wallet = new TaikoWallet({
  network: 'HEKLA', // or 'ALETHIA' for mainnet
  enableShield: true // optional, defaults to true
});

// Get network information
const networkConfig = wallet.getNetworkConfig();
console.log('Connected to network:', networkConfig.name);

// Get current chain ID
const chainId = await wallet.getChainId();

// Get balance of an address
const balance = await wallet.getBalance('0x...');

// Send a transaction (protected by Shield)
const tx = {
  to: '0x...',
  value: ethers.parseEther('0.1')
};
const txHash = await wallet.sendTransaction(tx);

// Sign a message
const signature = await wallet.signMessage('Hello Taiko!');
```

## Environment Variables

The SDK requires the following environment variables to be set:

- `TAIKO_MAINNET_RPC` (optional, defaults to "https://rpc.taiko.xyz")
- `TAIKO_TESTNET_RPC` (optional, defaults to "https://rpc.hekla.taiko.xyz")
- `WALLET_DOMAIN` (optional, defaults to 'https://wallet.taiko.xyz')
- `WALLET_ECOSYSTEM_ID` (optional, defaults to 'taiko-ecosystem')

## Features

- Network configuration management
- Balance checking
- Transaction sending (with Shield protection)
- Message signing (with Shield protection)
- Chain ID retrieval
- Shield protection toggling

## License

MIT

