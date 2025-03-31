
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStore, Product } from '@/store/useStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/products/ProductCard';

export function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const products = useStore((state) => state.products);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [upvotedProducts, setUpvotedProducts] = useState<Product[]>([]);

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

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        {/* <Avatar className="h-20 w-20 md:h-24 md:w-24">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar> */}

        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
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
