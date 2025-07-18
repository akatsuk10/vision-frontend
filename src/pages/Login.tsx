
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loading, loginWithWallet, walletAddress, registerWithWallet, walletError, clearWalletError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showWalletRegister, setShowWalletRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      if (isSignUp) {
        toast.success('Account created! Please log in.');
        setIsSignUp(false);
        return;
      }
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error) {
      toast.error('Login failed', {
        description: 'Use email: user@example.com, password: password'
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Successfully logged in with Google!');
      navigate('/');
    } catch (error) {
      toast.error('Google login failed');
    }
  };

  const handleWalletLogin = async () => {
    try {
      await loginWithWallet();
      toast.success('Wallet login successful!');
      navigate('/');
    } catch (err: any) {
      setShowWalletRegister(true);
    }
  };

  const handleWalletRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail) {
      toast.error('Please enter your email');
      return;
    }
    try {
      await registerWithWallet(registerEmail);
      toast.success('Wallet registered and linked!');
      setShowWalletRegister(false);
      clearWalletError();
      navigate('/');
    } catch (err) {
      // Error is handled by walletError
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">{isSignUp ? 'Create an account' : 'Welcome back'}</h1>
        <p className="text-muted-foreground">
          {isSignUp
            ? 'Sign up to discover amazing products'
            : 'Sign in to continue your journey'}
        </p>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </Button>

        <div className="flex items-center">
          <div className="flex-grow h-px bg-border"></div>
          <div className="px-3 text-xs text-muted-foreground">OR</div>
          <div className="flex-grow h-px bg-border"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isSignUp && (
            <div className="text-sm text-right">
              <Link to="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>

          <div className="text-center text-sm">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-primary hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </form>

        <div className="flex flex-col gap-2">
          <WalletMultiButton className="w-full" />
          <Button className="w-full" variant="outline" onClick={handleWalletLogin}>
            Login with Wallet
          </Button>
        </div>

        {walletError && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded p-3 text-sm flex flex-col gap-2 mt-2">
            <span>{walletError}</span>
            <Button size="sm" variant="outline" onClick={clearWalletError} className="self-end">Dismiss</Button>
          </div>
        )}

        {showWalletRegister && !walletError && (
          <form onSubmit={handleWalletRegister} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="registerEmail" className="text-sm font-medium">
                Email for Wallet Registration
              </label>
              <Input
                id="registerEmail"
                type="email"
                placeholder="name@example.com"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Register Wallet
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-muted-foreground">
          <p>
            By continuing, you agree to our{' '}
            <Link to="/terms" className="underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Demo info */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <p className="font-medium mb-1">Demo Login:</p>
          <p>Email: user@example.com</p>
          <p>Password: password</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
