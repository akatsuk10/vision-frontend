
import { Link } from 'react-router-dom';
import { ChevronUp, MessageSquare, ExternalLink } from 'lucide-react';
import { useStore, Product } from '@/store/useStore';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const upvoteProduct = useStore((state) => state.upvoteProduct);
  const removeUpvote = useStore((state) => state.removeUpvote);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("You need to be logged in to upvote products", {
        description: "Please sign in to continue",
        action: {
          label: "Sign In",
          onClick: () => {
            window.location.href = "/login";
          }
        }
      });
      return;
    }
    
    if (product.hasUpvoted) {
      removeUpvote(product.id);
      toast("Upvote removed");
    } else {
      upvoteProduct(product.id);
      toast("Product upvoted!");
    }
  };

  return (
    <Link to={`/products/${product.id}`}>
      <div className={`product-card ${featured ? 'border-brand-purple' : ''}`}>
        <div className="p-4 flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 overflow-hidden rounded-md border bg-muted">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base sm:text-lg line-clamp-1">{product.title}</h3>
              {featured && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-brand-purple bg-opacity-10 text-brand-purple">
                  Featured
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.tagline}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={product.author.avatar} alt={product.author.name} />
                  <AvatarFallback>{product.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{product.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{product.comments.length}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`upvote-button ${product.hasUpvoted ? 'text-brand-purple' : ''}`}
              onClick={handleUpvote}
            >
              <ChevronUp className={`h-5 w-5 ${product.hasUpvoted ? 'fill-brand-purple' : ''}`} />
              <span>{product.upvotes}</span>
            </Button>
            <a 
              href={product.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Visit</span>
            </a>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
