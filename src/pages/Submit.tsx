import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { UploadCloud, X } from 'lucide-react';

export function Submit() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const createProduct = useStore((state) => state.createProduct);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
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
    // if (file) {
    //   // Create a preview URL
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setImagePreview("https://fastly.picsum.photos/id/528/200/300.jpg?hmac=nQ5klrDwddW0du03zqKfOpyHkFBDaspI729AfK_FXPY");
    //   };
    //   reader.readAsDataURL(file);
    // }
    setImagePreview("https://fastly.picsum.photos/id/528/200/300.jpg?hmac=nQ5klrDwddW0du03zqKfOpyHkFBDaspI729AfK_FXPY")
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !link || !imagePreview) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would upload the image to a server here
      // For now, we'll use the base64 image data

      const newProduct = await createProduct(
        name,
        description,
        imagePreview,
        link
      );
      

      toast.success('Product submitted successfully!');
      navigate(`/profile`);
    } catch (error) {
      console.error('Error submitting product:', error);
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
            <label htmlFor="name" className="text-sm font-medium">
              Product Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Product"
              required
            />
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
            <label htmlFor="link" className="text-sm font-medium">
              Website URL <span className="text-red-500">*</span>
            </label>
            <Input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
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
