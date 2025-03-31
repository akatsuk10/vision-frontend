
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronUp, MessageSquare, Share2, Bookmark, ExternalLink, ChevronLeft } from 'lucide-react';
import { useStore, Product, Comment } from '@/store/useStore';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const products = useStore((state) => state.products);
  const upvoteProduct = useStore((state) => state.upvoteProduct);
  const removeUpvote = useStore((state) => state.removeUpvote);
  const addComment = useStore((state) => state.addComment);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      
      if (!foundProduct) {
        toast.error('Product not found');
      }
    }
  }, [id, products]);
  
  if (!product) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }
  
  const handleUpvote = () => {
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
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("You need to be logged in to comment", {
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
    
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        content: commentText,
        authorId: user?.id || '',
        authorName: user?.name || '',
        authorAvatar: user?.avatar || '',
        createdAt: new Date().toISOString(),
      };
      
      addComment(product.id, newComment);
      setCommentText('');
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'recently';
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.tagline,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to products
      </Link>
      
      {/* Product header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3">
          <div className="w-full aspect-square overflow-hidden rounded-lg border bg-muted">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-xl text-muted-foreground mb-4">{product.tagline}</p>
          
          <div className="flex items-center gap-3 mb-6">
            <Button
              onClick={handleUpvote}
              variant="outline"
              className={`gap-2 ${product.hasUpvoted ? 'text-brand-purple border-brand-purple' : ''}`}
            >
              <ChevronUp className={`h-5 w-5 ${product.hasUpvoted ? 'fill-brand-purple' : ''}`} />
              <span>Upvote</span>
              <span className="font-semibold">{product.upvotes}</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
            
            <a
              href={product.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Visit Website</span>
            </a>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={product.author.avatar} alt={product.author.name} />
                <AvatarFallback>{product.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{product.author.name}</span>
            </div>
            <span>•</span>
            <span>{formatDate(product.createdAt)}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {product.categories.map((category) => (
              <span
                key={category}
                className="px-2 py-1 text-xs bg-secondary rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Product description */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">About this product</h2>
        <p className="text-base whitespace-pre-line">{product.description}</p>
      </div>
      
      <Separator className="my-8" />
      
      {/* Comments section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <span>Comments ({product.comments.length})</span>
        </h2>
        
        {/* Comment form */}
        <form onSubmit={handleSubmitComment} className="mb-8">
          <Textarea
            placeholder="Share your thoughts..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-24 mb-3"
            disabled={!isAuthenticated || isLoading}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!isAuthenticated || isLoading}>
              {isLoading ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
        
        {/* Comments list */}
        <div className="space-y-6">
          {product.comments.length > 0 ? (
            product.comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                    <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{comment.authorName}</h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-line">{comment.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
