
import { useStore } from '@/store/useStore';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Categories() {
  const categories = useStore((state) => state.categories);
  const setFilter = useStore((state) => state.setFilter);

  const handleCategoryClick = (categorySlug: string) => {
    setFilter({ category: categorySlug });
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Categories</h1>
        <p className="text-muted-foreground">
          Explore products by category
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            to="/"
            onClick={() => handleCategoryClick(category.slug)}
            className="hover-scale"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover the best {category.name.toLowerCase()} products
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Categories;
