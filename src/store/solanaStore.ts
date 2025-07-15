import { create } from 'zustand';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PROGRAM_ID } from '../../constant/programId';

interface SolanaState {
  // Connection and wallet
  connection: Connection | null;
  wallet: Window['solana'] | null;
  publicKey: PublicKey | null;
  isConnected: boolean;
  balance: number;
  
  // Loading states
  isConnecting: boolean;
  
  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getBalance: () => Promise<void>;
  launchProduct: (args: {
    name: string;
    description: string;
    tokenSymbol: string;
    initialDeposit: number;
    ipoSlots: number;
    initialTokenSupply: number;
    launchDate: number;
  }) => Promise<string>;
}

export const useSolanaStore = create<SolanaState>((set, get) => ({
  // Initial state
  connection: null,
  wallet: null,
  publicKey: null,
  isConnected: false,
  balance: 0,
  isConnecting: false,

  // Connect wallet
  connectWallet: async () => {
    set({ isConnecting: true });
    
    try {
      // Check if Phantom wallet is available
      if (!window.solana || !window.solana.isPhantom) {
        throw new Error('Phantom wallet is not installed. Please install it from https://phantom.app/');
      }

      // Connect to wallet
      const response = await window.solana.connect();
      const publicKey = new PublicKey(response.publicKey.toString());
      
      // Create connection (using devnet for development)
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      
      set({
        wallet: window.solana,
        publicKey,
        isConnected: true,
        connection,
        isConnecting: false,
      });

      // Get balance after connection
      await get().getBalance();
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      set({ isConnecting: false });
      throw error;
    }
  },

  // Disconnect wallet
  disconnectWallet: () => {
    if (get().wallet) {
      get().wallet.disconnect();
    }
    
    set({
      wallet: null,
      publicKey: null,
      isConnected: false,
      connection: null,
      balance: 0,
    });
  },

  // Get wallet balance
  getBalance: async () => {
    const { connection, publicKey } = get();
    
    if (!connection || !publicKey) return;

    try {
      const balance = await connection.getBalance(publicKey);
      set({ balance: balance / LAMPORTS_PER_SOL });
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  },

  // Launch product (placeholder for now)
  launchProduct: async (args) => {
    const { publicKey } = get();
    
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      // For now, we'll just return a mock transaction signature
      // In a real implementation, this would call the Anchor program
      console.log('Launching product with args:', args);
      console.log('Program ID:', PROGRAM_ID);
      
      // Mock transaction signature
      const mockTx = 'mock_transaction_signature_' + Date.now();
      
      return mockTx;
    } catch (error) {
      console.error('Error launching product:', error);
      throw error;
    }
  },

  // User bid on product (placeholder for now)
  userBidProduct: async (productOwner: string, amount: number, slotsRequested: number) => {
    const { publicKey } = get();
    
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      // For now, we'll just return a mock transaction signature
      // In a real implementation, this would call the Anchor program
      console.log('Bidding on product:', { productOwner, amount, slotsRequested });
      
      // Mock transaction signature
      const mockTx = 'mock_bid_transaction_' + Date.now();
      
      return mockTx;
    } catch (error) {
      console.error('Error bidding on product:', error);
      throw error;
    }
  },
}));

// Add window.solana type
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => void;
    };
  }
} 