
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, Product } from '@/store/useStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { UploadCloud, Plus, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export function Submit() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const categories = useStore((state) => state.categories);
  const addProduct = useStore((state) => state.addProduct);
  
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    toast.error('You need to be logged in to submit a product');
    return null;
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImagePreview(null);
  };
  
  const handleCategoryToggle = (categorySlug: string) => {
    setSelectedCategories((prev) => 
      prev.includes(categorySlug)
        ? prev.filter(c => c !== categorySlug)
        : [...prev, categorySlug]
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !tagline || !description || !websiteUrl || !imagePreview || selectedCategories.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload the image to a server here
      
      const newProduct: Product = {
        id: Date.now().toString(), // in a real app, the server would generate this
        title,
        tagline,
        description,
        imageUrl: imagePreview, // in a real app, this would be the URL from the server
        websiteUrl,
        categories: selectedCategories,
        upvotes: 0,
        hasUpvoted: false,
        createdAt: new Date().toISOString(),
        author: {
          id: user?.id || '',
          name: user?.name || '',
          avatar: user?.avatar || '',
        },
        comments: [],
      };
      
      addProduct(newProduct);
      
      toast.success('Product submitted successfully!');
      navigate(`/products/${newProduct.id}`);
    } catch (error) {
      toast.error('Failed to submit product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit a Product</h1>
        <p className="text-muted-foreground">
          Share your product with the community and get valuable feedback.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Product Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Product"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="tagline" className="text-sm font-medium">
              Tagline <span className="text-red-500">*</span>
            </label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="A short, catchy description of your product"
              required
            />
            <p className="text-xs text-muted-foreground">
              Keep it short and sweet (max 100 characters)
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your product, what problem it solves, and why people should use it."
              className="min-h-32"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="websiteUrl" className="text-sm font-medium">
              Website URL <span className="text-red-500">*</span>
            </label>
            <Input
              id="websiteUrl"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>
        </div>
        
        {/* Image upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Product Image <span className="text-red-500">*</span></h3>
          
          {imagePreview ? (
            <div className="relative w-full max-w-md">
              <img 
                src={imagePreview} 
                alt="Product preview" 
                className="w-full aspect-square object-cover rounded-lg border" 
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1"
                aria-label="Remove image"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="border border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                id="productImage"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label
                htmlFor="productImage"
                className="flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              >
                <UploadCloud className="h-10 w-10 mb-2" />
                <p className="font-medium">Click to upload</p>
                <p className="text-sm">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>
          )}
        </div>
        
        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Categories <span className="text-red-500">*</span></h3>
          <p className="text-sm text-muted-foreground">
            Select at least one category that best describes your product
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.slug}`}
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={() => handleCategoryToggle(category.slug)}
                />
                <label
                  htmlFor={`category-${category.slug}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <span className="mr-1">{category.icon}</span> {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Submit button */}
        <div className="pt-4">
          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Submit;
