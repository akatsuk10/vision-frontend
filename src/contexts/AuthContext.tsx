import React, { createContext, useContext, useState, useEffect } from "react";
import { useStore, User } from '@/store/useStore';
import axios from 'axios';
import bs58 from "bs58";
import { useWallet } from '@solana/wallet-adapter-react';

const API_URL = "http://localhost:5000";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
  loginAction: (user: User) => void;
  signup: (email: string) => Promise<void>;
  verifyEmailToken: (token: string) => Promise<{ tempToken: string }>;
  setPasswordWithToken: (token: string, password: string) => Promise<{ accessToken: string }>;
  walletAddress: string | null;
  loginWithWallet: () => Promise<void>;
  registerWithWallet: (email: string) => Promise<void>;
  logoutWallet: () => void;
  walletError: string | null;
  clearWalletError: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const storeUser = useStore((state) => state.user);
  const loginAction = useStore((state) => state.login);
  const logoutAction = useStore((state) => state.logout);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [walletUser, setWalletUser] = useState<User | null>(null);

  // Wallet adapter hooks
  const { publicKey, signMessage, connected, connect, disconnect } = useWallet();

  useEffect(() => {
    setLoading(false);
    if (publicKey) {
      setWalletAddress(publicKey.toString());
    } else {
      setWalletAddress(null);
      setWalletUser(null);
    }
  }, [publicKey]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/login`, { email, password });
      const { accessToken } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      const userdata = await axios.get(`${API_URL}/api/v1/auth/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const user: User = userdata.data.user;
      loginAction(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/v1/auth/register`, { email });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailToken = async (token: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/auth/verify-email?token=${token}`);
      return response.data.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setPasswordWithToken = async (token: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/auth/set-password`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Set password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const GOOGLE_CLIENT_ID = "823659717827-egjbfce4ot5ufshk60ovv8be5og8rphv.apps.googleusercontent.com";
      const REDIRECT_URI = `${API_URL}/api/v1/auth/google`;
      const googleAuthURL = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=email profile`;
      window.location.href = googleAuthURL;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    logoutAction();
    setWalletUser(null);
  };

  const loginWithWallet = async () => {
    setWalletError(null);
    if (!publicKey || !signMessage) {
      await connect();
      if (!publicKey || !signMessage) {
        setWalletError("Please select and connect a wallet first.");
        throw new Error("Please select and connect a wallet first.");
      }
    }
    const address = publicKey.toString();
    setWalletAddress(address);
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/auth/wallet-nonce?wallet=${address}`);
      const nonce = data.nonce;
      const encoded = new TextEncoder().encode(nonce);
      const signature = await signMessage(encoded);
      const signatureBase58 = bs58.encode(signature);
      const loginResp = await axios.post(`${API_URL}/api/v1/auth/wallet-login`, { walletAddress: address, signature: signatureBase58, nonce });
      if (loginResp.data.registered) {
        setWalletUser(loginResp.data.user);
      } else {
        setWalletError("Wallet not registered. Please register your wallet with your email.");
        throw new Error("Wallet not registered. Please register your wallet with your email.");
      }
    } catch (err: any) {
      setWalletError(err?.response?.data?.error?.message || err.message || "Wallet login failed");
      throw err;
    }
  };

  const registerWithWallet = async (email: string) => {
    setWalletError(null);
    if (!walletAddress || !signMessage) throw new Error("No wallet connected");
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/auth/wallet-nonce?wallet=${walletAddress}`);
      const nonce = data.nonce;
      const encoded = new TextEncoder().encode(nonce);
      const signature = await signMessage(encoded);
      const signatureBase58 = bs58.encode(signature);
      const regResp = await axios.post(`${API_URL}/api/v1/auth/wallet-register`, { walletAddress, signature: signatureBase58, nonce, email });
      setWalletUser(regResp.data.user);
      loginAction(regResp.data.user); // <-- update Zustand store user
    } catch (err: any) {
      setWalletError(err?.response?.data?.error?.message || err.message || "Wallet registration failed");
      throw err;
    }
  };

  const logoutWallet = () => {
    setWalletAddress(null);
    setWalletUser(null);
    disconnect();
  };

  const clearWalletError = () => setWalletError(null);

  // isAuthenticated: true if either email login or wallet login succeeded
  const isAuthenticated = !!storeUser || !!walletUser;
  const user = storeUser || walletUser;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        loginWithGoogle,
        logout,
        loading,
        loginAction,
        signup,
        verifyEmailToken,
        setPasswordWithToken,
        walletAddress,
        loginWithWallet,
        registerWithWallet,
        logoutWallet,
        walletError,
        clearWalletError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
