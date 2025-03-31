
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';

export function CategoryList() {
  const categories = useStore((state) => state.categories);
  const activeFilter = useStore((state) => state.activeFilters.category);
  const setFilter = useStore((state) => state.setFilter);

  const handleCategoryClick = (categorySlug: string | null) => {
    setFilter({ category: categorySlug });
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-2 py-2 px-1">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap ${
            activeFilter === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap ${
              activeFilter === category.slug
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
