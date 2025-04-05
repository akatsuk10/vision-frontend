import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import Layout from "@/components/layout/Layout";

// Pages
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Login from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { VerifyEmail } from "@/pages/VerifyEmail";
import { SetPassword } from "@/pages/SetPassword";
import Submit from "@/pages/Submit";
import Profile from "@/pages/Profile";
import Categories from "@/pages/Categories";
import Search from "@/pages/Search";
import NotFound from "@/pages/NotFound";
import { GoogleCallback } from "@/pages/GoogleCallback";

// Initialize query client for React Query
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/set-password" element={<SetPassword />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
