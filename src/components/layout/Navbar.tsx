"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useCart } from "@/lib/contexts/CartContext";
import { 
  ShoppingCart, 
  User as UserIcon, 
  LogOut, 
  Package, 
  ChevronDown, 
  Menu, 
  X,
  Home
} from "lucide-react";

type Category = { _id: string; name: string };

const FALLBACK_CATEGORIES: Category[] = [
  { _id: 'motors', name: 'Motors' },
  { _id: 'esc', name: 'ESC' },
  { _id: 'frames', name: 'Frames' },
  { _id: 'controllers', name: 'Controllers' },
  { _id: 'propellers', name: 'Propellers' },
  { _id: 'cameras', name: 'Cameras' },
  { _id: 'stack', name: 'Stack' },
  { _id: 'accessories', name: 'Accessories' },
];

export default function Navbar() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { cartCount, isLoading: cartLoading } = useCart();
  const pathname = usePathname();
  
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const navLinkStyle = (path: string) => 
    `relative flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 py-2 ${
      pathname === path ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <nav className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo (Left) */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-indigo-200 shadow-lg group-hover:scale-105 transition-transform duration-200">
                <Package className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900">
                Nimbuzki<span className="text-indigo-600">Store</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation (Center) */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={navLinkStyle("/")}>
              <Home className="w-4 h-4" /> Home
            </Link>

            <div 
              className="relative group h-full flex items-center"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <button 
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${isShopDropdownOpen ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                Shop <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isShopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Enhanced Dropdown Menu */}
              <div className={`absolute top-[80%] left-1/2 -translate-x-1/2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 transition-all duration-300 origin-top transform ${isShopDropdownOpen ? 'opacity-100 scale-100 visible translate-y-2' : 'opacity-0 scale-95 invisible'}`}>
                <div className="grid grid-cols-1 gap-1">
                  <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categories</p>
                  {categoriesLoading ? (
                    <div className="py-4 flex justify-center"><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-indigo-600"></div></div>
                  ) : (
                    <>
                      {categories.map((cat) => (
                        <Link 
                          key={cat._id}
                          href={`/categories/${cat._id}`}
                          onClick={() => setIsShopDropdownOpen(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all duration-200"
                        >
                          {cat.name}
                        </Link>
                      ))}
                      <div className="mt-2 pt-2 border-t border-gray-50">
                        <Link 
                          href="/products"
                          onClick={() => setIsShopDropdownOpen(false)}
                          className="block px-4 py-3 text-sm text-center font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-100"
                        >
                          Browse All Gear
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link 
              href="/cart" 
              className="relative p-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {(!cartLoading && cartCount > 0) && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-bold text-white bg-red-500 rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-8 w-px bg-gray-200 hidden md:block mx-2"></div>

            <div className="hidden md:flex items-center gap-4">
              {authLoading ? (
                <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-xl"></div>
              ) : user ? (
                <div 
                  className="relative group"
                  onMouseEnter={() => setIsProfileDropdownOpen(true)}
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  <button className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-100 transition-colors">
                    <div className="bg-white p-1 rounded-full shadow-sm">
                      <UserIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800 max-w-[100px] truncate">
                      {user.role === "admin" ? `Admin (${user.name})` : user.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  <div className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 transition-all duration-300 origin-top transform ${isProfileDropdownOpen ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-2'}`}>
                    {user.role === "admin" && (
                      <>
                        <Link href="/admin" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                          Admin Panel
                        </Link>
                        <div className="h-px bg-gray-100 my-1"></div>
                      </>
                    )}
                    <Link href="/profile" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                      Profile
                    </Link>
                    <Link href="/orders" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                      Orders
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                      onClick={() => { logout(); setIsProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition">
                    Login
                  </Link>
                  <Link href="/signup" className="px-5 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-white border-b border-gray-100 shadow-2xl transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-6 py-8 space-y-8">
          <div className="space-y-4">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 text-xl font-bold text-gray-900"
            >
              <Home className="w-5 h-5 text-indigo-600" /> Home
            </Link>
            
            <div>
              <button 
                onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                className="flex items-center justify-between w-full text-xl font-bold text-gray-900"
              >
                Shop
                <ChevronDown className={`w-6 h-6 transition-transform ${isMobileShopOpen ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>
              
              <div className={`transition-all duration-300 overflow-hidden ${isMobileShopOpen ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="grid grid-cols-2 gap-2 pl-4 border-l-2 border-indigo-100">
                  {categories.map((cat) => (
                    <Link 
                      key={cat._id}
                      href={`/categories/${cat._id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2 text-base text-gray-600 font-medium"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
             {user ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-700">
                      <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Account</p>
                      <p className="text-lg font-bold text-gray-900">{user.role === "admin" ? `Admin (${user.name})` : user.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {user.role === "admin" && (
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold flex justify-center items-center gap-2">
                        Admin Panel
                      </Link>
                    )}
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-bold flex justify-center items-center gap-2">
                      Profile
                    </Link>
                    <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-bold flex justify-center items-center gap-2">
                      Orders
                    </Link>
                    <button
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold flex justify-center items-center gap-2 mt-2"
                    >
                      <LogOut className="h-5 w-5" /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-center shadow-lg shadow-indigo-100">
                    Create Account
                  </Link>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold text-center border border-gray-100">
                    Sign In
                  </Link>
                </div>
              )}
          </div>
        </div>
      </div>
    </nav>
  );
}