"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/contexts/CartContext";
import { ArrowLeft, ShoppingCart, Check, Star, ShieldCheck, Box, ChevronRight } from "lucide-react";
import Link from "next/link";
import QuantitySelector from "@/components/store/QuantitySelector";
import ProductImageGallery from "@/components/store/ProductImageGallery";
import FeaturedProducts from "@/components/store/FeaturedProducts";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          router.push("/products"); // 404 redirect
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, router]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await addToCart(product._id, quantity);
    setAddingToCart(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    // Redirect directly to checkout with productId and quantity as requested
    router.push(`/checkout?productId=${product._id}&quantity=${quantity}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-sm font-medium text-gray-500 mb-8">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <span className="hover:text-indigo-600 transition-colors cursor-pointer">
          {product.category?.name || "Category"}
        </span>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <span className="text-gray-900 truncate max-w-[200px] sm:max-w-md">{product.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-16">
        {/* Product Images - Left Side */}
        <div className="mb-10 lg:mb-0">
          <ProductImageGallery images={product.images || []} productName={product.name} />
        </div>

        {/* Product Details - Right Side */}
        <div className="flex flex-col">
          <p className="text-indigo-600 font-bold mb-2 tracking-wide uppercase text-sm">
            {product.category?.name || "Premium Component"}
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight sm:leading-tight mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-extrabold text-gray-900">
              ${product.discountPrice ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
            </span>
            {product.discountPrice && (
              <span className="text-xl font-medium text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ml-2 ${
              product.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
               {product.stock > 0 ? <ShieldCheck className="w-4 h-4" /> : <Box className="w-4 h-4" />} 
               {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
            </div>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="border-t border-b border-gray-100 py-6 mb-8 mt-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
               <span className="flex items-center gap-2">
                 <Star className="text-amber-400 w-5 h-5 fill-amber-400" /> 
                 4.9/5 Average Rating
               </span>
               <span className="underline cursor-pointer hover:text-indigo-600">Read Reviews</span>
            </div>
            
            <QuantitySelector 
              quantity={quantity} 
              onIncrement={() => setQuantity(q => q + 1)} 
              onDecrement={() => setQuantity(q => q > 1 ? q - 1 : 1)}
              max={product.stock}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-bold text-lg transition duration-300 shadow-sm border-2 ${
                added 
                  ? "bg-green-500 border-green-500 text-white shadow-green-500/30" 
                  : "bg-white border-gray-200 text-gray-900 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {addingToCart ? (
                 <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              ) : added ? (
                <> <Check className="w-6 h-6" /> Added to Cart </>
              ) : (
                <> <ShoppingCart className="w-6 h-6" /> Add to Cart </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 py-4 px-8 rounded-2xl font-bold text-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      {product.category && (
        <FeaturedProducts categoryId={product.category._id} currentProductId={product._id} />
      )}
    </div>
  );
}
