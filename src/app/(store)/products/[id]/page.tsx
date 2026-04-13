"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/contexts/CartContext";
import { ArrowLeft, ShoppingCart, Check, Star, ShieldCheck, Box } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  
  const { addToCart, user } = useCart(); // Assuming useCart exposes `user` if needed, wait, AuthContext exposes user. Let's assume AddToCart handles auth check or throws.

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
    await addToCart(product._id, 1);
    setAddingToCart(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
      <button onClick={() => router.back()} className="inline-flex items-center text-indigo-600 font-medium mb-8 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>

      <div className="lg:grid lg:grid-cols-2 lg:gap-16">
        {/* Product Images */}
        <div className="mb-10 lg:mb-0">
          <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 relative shadow-sm">
            {product.images && product.images.length > 0 ? (
               <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-400">
                 <Box className="w-24 h-24 text-gray-200" />
               </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <p className="text-indigo-600 font-bold mb-2 tracking-wide uppercase text-sm">
            {product.category?.name || "Premium Component"}
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight sm:leading-tight mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
            <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
               <ShieldCheck className="w-4 h-4" /> In Stock ({product.stock})
            </div>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="border-t border-b border-gray-100 py-6 mb-8 mt-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
               <span className="flex items-center gap-2"><Star className="text-amber-400 w-5 h-5 fill-amber-400" /> 4.9/5 Average Rating</span>
               <span className="underline cursor-pointer">Read Reviews</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className={`w-full flex items-center justify-center gap-3 py-5 px-8 rounded-2xl font-bold text-lg text-white transition duration-300 shadow-lg ${
              added 
                ? "bg-green-500 hover:bg-green-600 shadow-green-500/30" 
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30"
            }`}
          >
            {addingToCart ? (
               <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : added ? (
              <> <Check className="w-6 h-6" /> Added to Cart </>
            ) : (
              <> <ShoppingCart className="w-6 h-6" /> Add to Cart </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
