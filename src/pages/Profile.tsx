
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStore, Product } from '@/store/useStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, user, registerWithWallet, walletError, clearWalletError } = useAuth();
  const products = useStore((state) => state.products);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [upvotedProducts, setUpvotedProducts] = useState<Product[]>([]);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const { publicKey, connected } = useWallet();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Filter products based on user
  useEffect(() => {
    if (user) {
      // Get products submitted by user
      const submittedProducts = products.filter(product =>
        product.author.id === user.id
      );
      // Get products upvoted by user
      const upvoted = products.filter(product => product.hasUpvoted);
      setUserProducts(submittedProducts);
      setUpvotedProducts(upvoted);
    }
  }, [products, user]);

  // Automatically register wallet if connected and user is logged in but has no walletAddress
  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      !user.walletAddress &&
      connected &&
      publicKey &&
      !registerSuccess &&
      !registerLoading
    ) {
      setRegisterLoading(true);
      registerWithWallet(user.email)
        .then(() => {
          setRegisterSuccess(true);
          clearWalletError();
        })
        .catch(() => {
          // walletError is handled by context
        })
        .finally(() => setRegisterLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, connected, publicKey]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <div className="text-center md:text-left w-full">
          <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
          <p className="text-muted-foreground mb-2">{user.email}</p>
          {user.walletAddress && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-1 mb-2 w-fit mx-auto md:mx-0">
              <span className="text-xs text-green-800 font-medium">Wallet:</span>
              <span className="text-xs text-green-900 font-mono">{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
            <div>
              <span className="text-lg font-medium">{userProducts.length}</span>{' '}
              <span className="text-muted-foreground">Products</span>
            </div>
            <div>
              <span className="text-lg font-medium">{upvotedProducts.length}</span>{' '}
              <span className="text-muted-foreground">Upvoted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Register Wallet if not linked */}
      {isAuthenticated && user && !user.walletAddress && (
        <div className="mb-8 max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Register your Wallet</h2>
          <p className="text-muted-foreground mb-4">Link your Solana wallet to your account for full access.</p>
          {!connected ? (
            <div className="flex flex-col items-center gap-2">
              <WalletMultiButton />
              <p className="text-xs text-muted-foreground mt-2">Connect your wallet to continue.</p>
            </div>
          ) : registerLoading ? (
            <div className="text-blue-700 font-medium mb-2">Registering wallet...</div>
          ) : registerSuccess ? (
            <div className="text-green-700 font-medium mb-2">Wallet successfully linked to your account!</div>
          ) : walletError ? (
            <div className="bg-red-100 border border-red-300 text-red-700 rounded p-2 text-xs flex flex-col gap-1">
              <span>{walletError}</span>
              <Button size="sm" variant="outline" onClick={clearWalletError} className="self-end">Dismiss</Button>
            </div>
          ) : null}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="upvoted">Upvoted</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {userProducts.length > 0 ? (
            userProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any products yet.
              </p>
              <button
                onClick={() => navigate('/submit')}
                className="text-primary hover:underline font-medium"
              >
                Submit your first product
              </button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upvoted" className="space-y-6">
          {upvotedProducts.length > 0 ? (
            upvotedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No upvoted products</h3>
              <p className="text-muted-foreground mb-4">
                You haven't upvoted any products yet.
              </p>
              <button
                onClick={() => navigate('/')}
                className="text-primary hover:underline font-medium"
              >
                Discover products
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Profile;
