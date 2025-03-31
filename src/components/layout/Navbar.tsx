
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Bell, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStore } from '@/store/useStore';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const setFilter = useStore((state) => state.setFilter);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ search: searchQuery });
  };

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6 lg:gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-brand-purple rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl hidden md:block">ProductHunt</span>
          </Link>
          
          <form onSubmit={handleSearch} className="hidden md:flex relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search products..."
              className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link to="/categories" className="text-sm font-medium hover:text-brand-purple transition-colors">
            Categories
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-brand-purple transition-colors">
            Trending
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-brand-purple transition-colors">
            New
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/submit">
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Submit</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                      <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={logout}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/login">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle Menu"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-16 z-50 w-full bg-background border-b md:hidden animate-fade-in">
            <div className="container p-4 space-y-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              
              <div className="space-y-2">
                <Link 
                  to="/categories" 
                  className="block p-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link 
                  to="/" 
                  className="block p-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trending
                </Link>
                <Link 
                  to="/" 
                  className="block p-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  New
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/submit" 
                      className="block p-2 text-sm hover:bg-muted rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Submit Product
                    </Link>
                    <Link 
                      to="/profile" 
                      className="block p-2 text-sm hover:bg-muted rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      className="block w-full text-left p-2 text-sm hover:bg-muted rounded-md"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block p-2 text-sm hover:bg-muted rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link 
                      to="/login" 
                      className="block p-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
