
import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
//  avatar: string;
//  isLoggedIn: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  tagline: string;
  imageUrl: string;
  websiteUrl: string;
  categories: string[];
  upvotes: number;
  hasUpvoted: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface AppState {
  user: User | null;
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  trendingProducts: Product[];
  filteredProducts: Product[];
  activeFilters: {
    category: string | null;
    search: string | null;
  };
  loading: boolean;

  // User actions
  login: (user: User) => void;
  logout: () => void;
  
  // Product actions
  addProduct: (product: Product) => void;
  upvoteProduct: (productId: string) => void;
  removeUpvote: (productId: string) => void;
  addComment: (productId: string, comment: Comment) => void;
  
  // Filter actions
  setFilter: (filter: { category?: string | null; search?: string | null }) => void;
  clearFilters: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      products: [],
      categories: [],
      featuredProducts: [],
      trendingProducts: [],
      filteredProducts: [],
      activeFilters: {
        category: null,
        search: null,
      },
      loading: false,

      login: (user) => set({ user }),
      logout: () => set({ user: null }),

      addProduct: (product) => 
        set((state) => ({ 
          products: [...state.products, product],
          filteredProducts: state.activeFilters.category || state.activeFilters.search 
            ? [...state.filteredProducts, product] 
            : [...state.products, product],
        })),

        upvoteProduct: async (productId: string) => {
          const accessToken = localStorage.getItem("accessToken")
          try {
            const response = await axios.post(`http://localhost:5000/api/v1/products/${productId}/vote`, {
             
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
        
            if (!response.ok) {
              throw new Error('Failed to upvote product');
            }
        
            set((state) => ({
              products: state.products.map((product) =>
                product.id === productId
                  ? { ...product, upvotes: product.upvotes + 1, hasUpvoted: true }
                  : product
              ),
            }));
          } catch (error) {
            console.error('Error upvoting product:', error);
          }
        },

      removeUpvote: (productId) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? { ...product, upvotes: product.upvotes - 1, hasUpvoted: false }
              : product
          ),
          filteredProducts: state.filteredProducts.map((product) =>
            product.id === productId
              ? { ...product, upvotes: product.upvotes - 1, hasUpvoted: false }
              : product
          ),
          featuredProducts: state.featuredProducts.map((product) =>
            product.id === productId
              ? { ...product, upvotes: product.upvotes - 1, hasUpvoted: false }
              : product
          ),
          trendingProducts: state.trendingProducts.map((product) =>
            product.id === productId
              ? { ...product, upvotes: product.upvotes - 1, hasUpvoted: false }
              : product
          ),
        })),

      addComment: (productId, comment) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? { ...product, comments: [...product.comments, comment] }
              : product
          ),
          filteredProducts: state.filteredProducts.map((product) =>
            product.id === productId
              ? { ...product, comments: [...product.comments, comment] }
              : product
          ),
        })),

      setFilter: (filter) =>
        set((state) => {
          const newFilters = {
            ...state.activeFilters,
            ...(filter.category !== undefined && { category: filter.category }),
            ...(filter.search !== undefined && { search: filter.search }),
          };

          const filtered = state.products.filter((product) => {
            const matchesCategory = !newFilters.category || product.categories.includes(newFilters.category);
            const matchesSearch = !newFilters.search || 
              product.title.toLowerCase().includes(newFilters.search.toLowerCase()) ||
              product.description.toLowerCase().includes(newFilters.search.toLowerCase()) ||
              product.tagline.toLowerCase().includes(newFilters.search.toLowerCase());
              
            return matchesCategory && matchesSearch;
          });

          return {
            activeFilters: newFilters,
            filteredProducts: filtered,
          };
        }),

      clearFilters: () =>
        set({ 
          activeFilters: { category: null, search: null },
          filteredProducts: []
        }),
    }),
    {
      name: 'product-hunt-store',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Helper to initialize the store with data
export const initializeStore = () => {
  const categories = [
    { id: '1', name: 'Tech', slug: 'tech', icon: '💻' },
    { id: '2', name: 'Design', slug: 'design', icon: '🎨' },
    { id: '3', name: 'Marketing', slug: 'marketing', icon: '📈' },
    { id: '4', name: 'Productivity', slug: 'productivity', icon: '⏱️' },
    { id: '5', name: 'Education', slug: 'education', icon: '📚' },
    { id: '6', name: 'Health', slug: 'health', icon: '🏥' },
    { id: '7', name: 'Finance', slug: 'finance', icon: '💰' },
    { id: '8', name: 'Entertainment', slug: 'entertainment', icon: '🎮' },
  ];

  const products = [
    {
      id: '1',
      title: 'Figma',
      tagline: 'Design, prototype, and gather feedback all in one place',
      description: 'Figma is a cloud-based design tool that is similar to Sketch in functionality and features, but with big differences that make Figma better for team collaboration.',
      imageUrl: 'https://images.unsplash.com/photo-1656942200475-53da75b58ab2?q=80&w=2940&auto=format&fit=crop',
      websiteUrl: 'https://figma.com',
      categories: ['design', 'productivity'],
      upvotes: 245,
      hasUpvoted: false,
      createdAt: '2023-10-15T09:24:00Z',
      author: {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop',
      },
      comments: [
        {
          id: '1',
          content: 'Game changer for our design team!',
          authorId: '2',
          authorName: 'Mike Chen',
          authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2787&auto=format&fit=crop',
          createdAt: '2023-10-16T14:22:00Z',
        }
      ],
    },
    {
      id: '2',
      title: 'Notion',
      tagline: 'All-in-one workspace for notes, tasks, wikis, and databases',
      description: 'Notion is an all-in-one workspace for your notes, tasks, wikis, and databases. It is a new tool that blends your everyday work apps into one. It is the all-in-one workspace for you and your team.',
      imageUrl: 'https://images.unsplash.com/photo-1629429407759-01cd3d7cfb38?q=80&w=2940&auto=format&fit=crop',
      websiteUrl: 'https://notion.so',
      categories: ['productivity', 'tech'],
      upvotes: 189,
      hasUpvoted: false,
      createdAt: '2023-10-14T11:45:00Z',
      author: {
        id: '3',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2922&auto=format&fit=crop',
      },
      comments: [
        {
          id: '1',
          content: 'I use this for everything - personal and work!',
          authorId: '4',
          authorName: 'Emily Watson',
          authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2788&auto=format&fit=crop',
          createdAt: '2023-10-15T08:12:00Z',
        }
      ],
    },
    {
      id: '3',
      title: 'Linear',
      tagline: 'The issue tracking tool you will enjoy using',
      description: 'Linear helps streamline software projects, sprints, tasks, and bug tracking. It is built for high-performance teams.',
      imageUrl: 'https://images.unsplash.com/photo-1573495627361-d9b87960b12d?q=80&w=2069&auto=format&fit=crop',
      websiteUrl: 'https://linear.app',
      categories: ['productivity', 'tech'],
      upvotes: 162,
      hasUpvoted: false,
      createdAt: '2023-10-13T15:33:00Z',
      author: {
        id: '5',
        name: 'Jordan Lee',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2788&auto=format&fit=crop',
      },
      comments: [
        {
          id: '1',
          content: 'Best issue tracker I have ever used. The UI is fantastic.',
          authorId: '6',
          authorName: 'Taylor Kim',
          authorAvatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=2787&auto=format&fit=crop',
          createdAt: '2023-10-14T19:45:00Z',
        }
      ],
    },
    {
      id: '4',
      title: 'Midjourney',
      tagline: 'AI text-to-image generator with stunning quality',
      description: 'Midjourney is an independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species. It generates images from natural language descriptions.',
      imageUrl: 'https://images.unsplash.com/photo-1686191128864-ad9ab21b4e3d?q=80&w=2940&auto=format&fit=crop',
      websiteUrl: 'https://midjourney.com',
      categories: ['tech', 'design'],
      upvotes: 301,
      hasUpvoted: false,
      createdAt: '2023-10-12T10:19:00Z',
      author: {
        id: '7',
        name: 'Morgan Wright',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop',
      },
      comments: [
        {
          id: '1',
          content: 'The quality is mind-blowing compared to other AI art tools.',
          authorId: '8',
          authorName: 'Jamie Foster',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop',
          createdAt: '2023-10-13T13:52:00Z',
        }
      ],
    },
  ];

  // Set initial data to the store
  useStore.setState({
    categories,
    products,
    featuredProducts: [products[3]], // Midjourney as featured
    trendingProducts: [...products].sort((a, b) => b.upvotes - a.upvotes),
    filteredProducts: [],
  });
};
  