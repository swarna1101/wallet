import TaikoWallet from '../src';
import { ethers } from 'ethers';

async function main() {
  // Initialize the wallet with Shield protection enabled
  const wallet = new TaikoWallet({
    network: 'HEKLA', // Use testnet
    enableShield: true
  });

  // Connect to the wallet
  await wallet.connect();

  // Get network information
  const networkConfig = wallet.getNetworkConfig();
  console.log('Connected to network:', networkConfig.name);

  // Get current chain ID
  const chainId = await wallet.getChainId();
  console.log('Current chain ID:', chainId);

  // Get balance of an address
  const address = '0x...'; // Replace with actual address
  const balance = await wallet.getBalance(address);
  console.log('Balance:', balance);

  // Send a transaction (protected by Shield)
  try {
    const tx = {
      to: '0x...', // Replace with recipient address
      value: ethers.parseEther('0.1'), // 0.1 ETH
    };
    const txHash = await wallet.sendTransaction(tx);
    console.log('Transaction sent:', txHash);
  } catch (error) {
    console.error('Transaction failed:', error);
  }

  // Sign a message (protected by Shield)
  try {
    const message = 'Hello Taiko!';
    const signature = await wallet.signMessage(message);
    console.log('Message signed:', signature);
  } catch (error) {
    console.error('Message signing failed:', error);
  }

  // Disable Shield protection
  await wallet.disableShieldProtection();
  console.log('Shield protection disabled');
}

main().catch(console.error); 