
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/products/ProductCard';
import CategoryList from '@/components/products/CategoryList';

export function Home() {
  const featuredProducts = useStore((state) => state.featuredProducts);
  const trendingProducts = useStore((state) => state.trendingProducts);
  const filteredProducts = useStore((state) => state.filteredProducts);
  const activeFilters = useStore((state) => state.activeFilters);
  const clearFilters = useStore((state) => state.clearFilters);

  // Clear filters on component unmount
  useEffect(() => {
    return () => {
      clearFilters();
    };
  }, [clearFilters]);

  // Determine if we're showing filtered results
  const isFiltered = activeFilters.category || activeFilters.search;
  
  // Determine which products to display
  const productsToDisplay = isFiltered ? filteredProducts : trendingProducts;

  return (
    <div className="container px-4 py-6 md:py-8 lg:py-12 max-w-7xl mx-auto">
      {/* Hero section */}
      {!isFiltered && (
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-6">Discover the best products</h1>
          <div className="grid grid-cols-1 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </div>
        </section>
      )}

      {/* Category filter */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">
            {isFiltered ? 'Search Results' : 'Trending Products'}
          </h2>
        </div>
        <CategoryList />
      </section>

      {/* Product list */}
      <section>
        {isFiltered && filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="text-primary hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {productsToDisplay.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
