
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import CategoryList from '@/components/products/CategoryList';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const products = useStore((state) => state.products);
  const filteredProducts = useStore((state) => state.filteredProducts);
  const setFilter = useStore((state) => state.setFilter);
  const clearFilters = useStore((state) => state.clearFilters);
  
  const [query, setQuery] = useState(searchQuery);
  
  // Initial search based on URL params
  useEffect(() => {
    if (searchQuery) {
      setFilter({ search: searchQuery });
    } else {
      clearFilters();
    }
    
    // Clear filters on component unmount
    return () => {
      clearFilters();
    };
  }, [searchQuery, setFilter, clearFilters]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
    setFilter({ search: query });
  };
  
  const clearSearch = () => {
    setQuery('');
    setSearchParams({});
    clearFilters();
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Products</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="pl-9"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>
      
      {searchQuery && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            {filteredProducts.length} results for "{searchQuery}"
          </p>
        </div>
      )}
      
      <CategoryList />
      
      <div className="mt-6 space-y-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria.
            </p>
            {(searchQuery || filteredProducts.length !== products.length) && (
              <button
                onClick={clearSearch}
                className="text-primary hover:underline font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
