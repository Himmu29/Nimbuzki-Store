"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/contexts/CartContext";
import { ShoppingCart, Check } from "lucide-react";

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
    setAdding(true);
    await addToCart(product._id.toString(), 1);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const hasDiscount = !!product.discountPrice;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300 flex flex-col h-full min-w-[260px] max-w-[320px] shrink-0 sm:shrink">
      <Link href={`/products/${product._id}`} className="block flex-grow relative">
        {hasDiscount && (
          <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            SALE
          </div>
        )}
        
        <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
          {product.images && product.images.length > 0 ? (
             <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          ) : (
             <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
               <span className="text-xs">No Image</span>
             </div>
          )}
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          {product.category && (
             <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">{product.category.name}</p>
          )}
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition truncate">{product.name}</h3>
          
          <div className="flex items-center gap-2 mt-auto pt-2">
            {hasDiscount ? (
              <>
                <span className="text-xl font-extrabold text-red-600">${product.discountPrice?.toFixed(2)}</span>
                <span className="text-sm font-medium text-gray-400 line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <button
          onClick={handleAdd}
          disabled={adding}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition duration-300 ${
            added 
              ? "bg-green-100 text-green-700" 
              : "bg-gray-100 text-gray-900 hover:bg-indigo-600 hover:text-white"
          }`}
        >
          {adding ? (
             <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : added ? (
            <> <Check className="w-4 h-4" /> Added </>
          ) : (
            <> <ShoppingCart className="w-4 h-4" /> Add to Cart </>
          )}
        </button>
      </div>
    </div>
  );
}
