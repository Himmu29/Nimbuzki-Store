"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useCart } from "@/lib/contexts/CartContext";
import { ShoppingCart, User as UserIcon, LogOut, Package, ChevronDown, Menu, X } from "lucide-react";

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
  
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setCategories(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <nav className="fixed w-full z-50 top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo (Left) */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:bg-indigo-700 transition">
                <Package className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                Nimbuzki<span className="text-indigo-600">Store</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation (Center) */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div 
              className="relative group h-full flex items-center"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <button 
                className={`flex items-center gap-1.5 text-sm font-medium py-5 transition ${isShopDropdownOpen ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`}
                onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
              >
                Shop <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isShopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega/Dropdown Menu */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 transition-all duration-300 origin-top transform ${isShopDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                {categoriesLoading ? (
                  <div className="p-4 text-center text-sm text-gray-500 flex justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <ul className="grid grid-cols-1 gap-1">
                    {categories.map((cat) => (
                      <li key={cat._id}>
                        <Link 
                          href={`/categories/${cat._id}`}
                          onClick={() => setIsShopDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-xl transition-colors font-medium"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                       <Link 
                          href="/products"
                          onClick={() => setIsShopDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors font-bold mt-2 text-center"
                        >
                          View All Products
                        </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right Actions & Mobile Toggle */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link 
              href="/cart" 
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {(!cartLoading && cartCount > 0) && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

            <div className="hidden md:flex items-center">
              {authLoading ? (
                <div className="h-8 w-20 bg-gray-100 animate-pulse rounded-md"></div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="bg-gray-100 p-1.5 rounded-full">
                      <UserIcon className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="font-medium max-w-[100px] truncate">{user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-500 transition"
                  >
                    <LogOut className="h-4 w-4" /> <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                    Login
                  </Link>
                  <Link href="/signup" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm hover:shadow">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile nav toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-indigo-600 focus:outline-none p-1"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Accordion */}
      <div className={`md:hidden absolute w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[calc(100vh-4rem)] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-6 space-y-6">
          
          {/* Mobile Shop Accordion */}
          <div>
             <button 
                onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                className="flex items-center justify-between w-full text-left text-lg font-bold text-gray-900 pb-2 border-b border-gray-100"
              >
                Shop
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isMobileShopOpen ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileShopOpen ? 'max-h-96 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="space-y-1 py-2 pl-2 border-l-2 border-indigo-100 ml-2">
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <Link 
                        href={`/categories/${cat._id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-base text-gray-600 hover:text-indigo-600 font-medium rounded-lg hover:bg-gray-50"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link 
                      href="/products"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-base text-indigo-600 font-bold mt-2"
                    >
                      View All Products →
                    </Link>
                  </li>
                </ul>
              </div>
          </div>

          {/* Mobile Auth Status */}
          <div className="pt-4 border-t border-gray-100">
             {authLoading ? (
                <div className="h-10 bg-gray-100 animate-pulse rounded-xl w-full"></div>
              ) : user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2.5 rounded-full">
                      <UserIcon className="h-5 w-5 text-indigo-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Logged in as</p>
                      <p className="font-bold text-gray-900">{user.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex justify-center items-center py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex justify-center items-center py-3 bg-indigo-600 rounded-xl font-medium text-white hover:bg-indigo-700 shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
          </div>
        </div>
      </div>

    </nav>
  );
}
