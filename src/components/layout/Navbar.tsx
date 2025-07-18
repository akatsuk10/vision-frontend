"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Menu, X, Bell, Plus, Wallet } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useSolanaStore } from "@/store/solanaStore"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStore } from "@/store/useStore"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const { isAuthenticated, user, logout, walletAddress, logoutWallet, walletError, clearWalletError } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const setFilter = useStore((state) => state.setFilter)

  // Detect scroll for navbar shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilter({ search: searchQuery })
  }

  return (
    <header
      className={`w-full z-30 fixed top-0 bg-white/80 backdrop-blur-sm transition-all duration-200 h-16 flex items-center justify-center ${scrolled ? "shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "border-b border-gray-100"
        }`}
    >
      <div className="container flex justify-between  px-4 py-6 md:py-8 lg:py-12 max-w-7xl">
        <div className="flex items-center gap-6 lg:gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-8 w-8 bg-black rounded-lg flex items-center justify-center shadow-[inset_0_-2px_4px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.1)]"
            >
              <span className="text-white font-bold text-lg">V</span>
            </motion.div>
            <span className="font-bold text-xl hidden md:block text-black group-hover:text-gray-700 transition-colors">
              hunt
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search products..."
              className="pl-8 h-9 w-full rounded-lg border border-gray-200 bg-gray-50/50 text-black px-3 py-1 text-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <div className="flex gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/categories" className="text-sm font-medium">
                Categories
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="text-sm font-medium">
                Trending
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="text-sm font-medium">
                New
              </Link>
            </motion.div>
          </div>

          {/* Wallet Status */}
          <div className="flex items-center gap-2">
            {isAuthenticated && walletAddress && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1">
                <Wallet className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-800 font-medium">
                  {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logoutWallet}
                  className="h-6 px-2 text-xs text-green-600 hover:text-green-800"
                >
                  Disconnect
                </Button>
              </div>
            )}
            {isAuthenticated && user && user.email && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1">
                <span className="text-xs text-blue-800 font-medium">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  Logout
                </Button>
              </div>
            )}
            {walletError && (
              <div className="bg-red-100 border border-red-300 text-red-700 rounded p-2 text-xs flex flex-col gap-1 ml-2">
                <span>{walletError}</span>
                <Button size="sm" variant="outline" onClick={clearWalletError} className="self-end">Dismiss</Button>
              </div>
            )}
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-2 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <Link to="/submit">
                  <Button
                    size="sm"
                    className="bg-white text-black rounded-full border font-medium px-4 pl-1.5 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.15),0_1px_3px_rgba(0,0,0,0.1)] 
                    active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] 
                    transition-all duration-150"
                  >
                    <span className="border rounded-full px-1 py-1 bg-gray-50">
                      <Plus className="h-4 w-4" />
                    </span>
                    <span>Submit</span>
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Notifications"
                  className="text-gray-600 hover:text-black border hover:bg-gray-100 rounded-full transition-all duration-150"
                >
                  <Bell className="h-5 w-5" />
                </Button>
              </motion.div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-gray-100 text-gray-700">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white text-black rounded-lg shadow-lg border border-gray-100 p-1"
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="cursor-pointer text-gray-700 hover:text-black rounded-md focus:bg-gray-50"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings"
                      className="cursor-pointer text-gray-700 hover:text-black rounded-md focus:bg-gray-50"
                    >
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    className="cursor-pointer text-gray-700 hover:text-black rounded-md focus:bg-gray-50"
                    onClick={logout}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="text-sm font-medium hover:underline">
                  Log in
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup">
                  <Button
                    size="sm"
                    className="bg-black text-white rounded-lg font-medium px-4 shadow-inner shadow-white/80 hover:bg-gray-900 hover:shadow-[inset 0 4px 6px rgba(255, 255, 255, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.15)]  active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]  transition-all duration-150"
                  >
                    Sign up
                  </Button>
                </Link>
              </motion.div>
            </div>
          )}
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-16 z-50 w-full bg-white border-b md:hidden shadow-lg"
            >
              <div className="container p-4 space-y-4">
                <form onSubmit={handleSearch} className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 h-9 w-full rounded-lg border border-gray-200 bg-gray-50/50 text-black px-3 py-1 text-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                <div className="space-y-1">
                  <Link
                    to="/categories"
                    className="block p-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Categories
                  </Link>
                  <Link
                    to="/"
                    className="block p-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Trending
                  </Link>
                  <Link
                    to="/"
                    className="block p-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    New
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/submit"
                        className="block p-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Submit Product
                      </Link>
                      <Link
                        to="/profile"
                        className="block p-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block p-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => { logout(); setIsMenuOpen(false); }}
                        className="block w-full text-left p-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block p-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link
                        to="/signup"
                        className="block p-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Navbar

