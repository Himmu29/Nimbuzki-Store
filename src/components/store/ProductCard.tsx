"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/contexts/CartContext";
import { ShoppingCart, Check, ArrowUpRight } from "lucide-react";

type ProductCardProps = {
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images?: string[];
    category?: { name: string };
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents navigating to product page when clicking button
    setAdding(true);
    await addToCart(product._id.toString(), 1);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const hasDiscount = !!product.discountPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) 
    : 0;

  return (
    <div className="group relative bg-white rounded-3xl border border-gray-100/80 overflow-hidden hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all duration-500 flex flex-col h-full min-w-[200px] sm:min-w-0 max-w-[320px] sm:max-w-none shrink-0 sm:shrink">
      
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-4 left-4 z-20 bg-indigo-600 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg">
          -{discountPercentage}%
        </div>
      )}

      {/* Image Container */}
      <Link href={`/products/${product._id}`} className="block relative overflow-hidden aspect-[1/1]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Quick View Icon */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-sm border border-gray-100">
            <ArrowUpRight className="w-4 h-4 text-gray-600" />
          </div>
        </div>

        <div className="w-full h-full bg-[#f8f9fb] flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-300">
              <ShoppingCart className="w-8 h-8 opacity-20" />
              <span className="text-[10px] font-bold uppercase tracking-widest">No Preview</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-3">
          {product.category && (
            <span className="text-[10px] font-black text-indigo-500/80 uppercase tracking-[0.15em] mb-1 block">
              {product.category.name}
            </span>
          )}
          <Link href={`/products/${product._id}`}>
            <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors duration-300">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Add to Cart Section */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-lg font-black text-gray-900 leading-none">
                  ${product.discountPrice?.toFixed(2)}
                </span>
                <span className="text-xs font-medium text-gray-400 line-through mt-1">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-black text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={adding}
            className={`relative h-11 w-11 flex items-center justify-center rounded-2xl transition-all duration-300 transform active:scale-90 ${
              added 
                ? "bg-green-500 text-white shadow-[0_8px_20px_rgba(34,197,94,0.3)]" 
                : "bg-gray-900 text-white shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:bg-indigo-600 hover:shadow-indigo-200"
            }`}
          >
            {adding ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : added ? (
              <Check className="w-5 h-5 stroke-[3px]" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
            
            {/* Tooltip on Hover */}
            {!added && !adding && (
              <span className="absolute -top-10 scale-0 group-hover/btn:scale-100 bg-gray-900 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap transition-all duration-200 pointer-events-none">
                Add to Cart
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}