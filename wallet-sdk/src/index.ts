import { AppMetadata, Client } from "@openfort/ecosystem-js/client";
import { ethers } from "ethers";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Taiko network configurations
export const TAIKO_NETWORKS = {
  ALEPHIA: {
    chainId: 167000,
    rpcUrl: process.env.TAIKO_MAINNET_RPC || "https://rpc.taiko.xyz",
    name: "Taiko Alephia",
    isTestnet: false
  },
  HEKLA: {
    chainId: 167009,
    rpcUrl: process.env.TAIKO_TESTNET_RPC || "https://rpc.hekla.taiko.xyz",
    name: "Taiko Hekla",
    isTestnet: true
  }
} as const;

export type TaikoNetwork = keyof typeof TAIKO_NETWORKS;

interface TaikoWalletConfig {
  network?: TaikoNetwork;
  appMetadata?: AppMetadata;
  enableShield?: boolean;
}

class TaikoWallet extends Client {
  private readonly network: TaikoNetwork;
  private shieldEnabled: boolean;
  private ethersProvider: ethers.JsonRpcProvider;

  constructor(config: TaikoWalletConfig = {}) {
    const { network = "ALEPHIA", appMetadata, enableShield = true } = config;
    
    super({
      baseConfig: {
        ecosystemWalletDomain: process.env.WALLET_DOMAIN || 'https://wallet.taiko.xyz',
        windowStrategy: 'iframe',
        ecosystemId: process.env.WALLET_ECOSYSTEM_ID || 'taiko-ecosystem'
      },
      appMetadata,
      appearance: {
        logo: 'https://taiko.xyz/logo.png',
        name: 'Taiko Wallet',
        reverseDomainNameSystem: 'xyz.taiko.wallet',
      }
    });

    this.network = network;
    this.shieldEnabled = enableShield;
    const networkConfig = TAIKO_NETWORKS[network];
    this.ethersProvider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);

    if (this.shieldEnabled) {
      this.enableShieldProtection();
    }

    return new Proxy(this, {
      get: (target: TaikoWallet, prop: string | symbol): unknown => {
        if (prop in target) {
          const value = target[prop as keyof TaikoWallet];
          return typeof value === 'function' ? value.bind(target) : value;
        }
        return undefined;
      }
    });
  }

  /**
   * Get the current network configuration
   */
  public getNetworkConfig() {
    return TAIKO_NETWORKS[this.network];
  }

  /**
   * Get the balance of an address
   * @param address - The address to check balance for
   * @returns The balance in wei as a string
   */
  public async getBalance(address: string): Promise<string> {
    if (!ethers.isAddress(address)) {
      throw new Error('Invalid Ethereum address');
    }
    const balance = await this.ethersProvider.getBalance(address);
    return balance.toString();
  }

  /**
   * Get the current chain ID
   * @returns The chain ID as a number
   */
  public async getChainId(): Promise<number> {
    const network = await this.ethersProvider.getNetwork();
    return Number(network.chainId);
  }

  /**
   * Enable Shield protection for the wallet
   */
  public async enableShieldProtection(): Promise<void> {
    if (!this.shieldEnabled) {
      // @ts-ignore - enableShield is a protected method from the parent class
      await this.enableShield();
      this.shieldEnabled = true;
    }
  }

  /**
   * Disable Shield protection for the wallet
   */
  public async disableShieldProtection(): Promise<void> {
    if (this.shieldEnabled) {
      // @ts-ignore - disableShield is a protected method from the parent class
      await this.disableShield();
      this.shieldEnabled = false;
    }
  }

  /**
   * Check if Shield protection is enabled
   */
  public isShieldEnabled(): boolean {
    return this.shieldEnabled;
  }

  /**
   * Send a transaction on Taiko network
   * @param transaction - The transaction to send
   * @returns The transaction hash
   */
  public async sendTransaction(transaction: ethers.TransactionRequest): Promise<string> {
    if (this.shieldEnabled) {
      const signer = await this.ethersProvider.getSigner();
      const tx = await signer.sendTransaction(transaction);
      return tx.hash;
    } else {
      throw new Error('Shield protection must be enabled to send transactions');
    }
  }

  /**
   * Sign a message with the wallet
   * @param message - The message to sign
   * @returns The signature
   */
  public async signMessage(message: string): Promise<string> {
    if (this.shieldEnabled) {
      const signer = await this.ethersProvider.getSigner();
      return signer.signMessage(message);
    } else {
      throw new Error('Shield protection must be enabled to sign messages');
    }
  }
}

export default TaikoWallet;