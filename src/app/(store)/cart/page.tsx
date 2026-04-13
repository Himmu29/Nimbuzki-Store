"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/lib/contexts/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem } = useCart();

  const subtotal = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-indigo-50 p-6 rounded-full mb-6 text-indigo-400">
          <ShoppingBag className="h-16 w-16" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Discover amazing products in our store.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
        >
          Continue Shopping <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <ul className="divide-y divide-gray-100 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {cart.items.map((item) => (
              <li key={item.product._id} className="p-6 flex flex-col sm:flex-row gap-6">
                
                {/* Fallback Image Square */}
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden">
                  {item.product.images && item.product.images.length > 0 ? (
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="h-8 w-8 text-gray-300" />
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">Unit Price: ${item.product.price.toFixed(2)}</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 whitespace-nowrap">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <dl className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="font-medium text-gray-900">Calculated at checkout</dd>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between">
                <dt className="text-base font-bold text-gray-900">Estimated Total</dt>
                <dd className="text-lg font-extrabold text-indigo-600">${subtotal.toFixed(2)}</dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="mt-8 w-full bg-indigo-600 text-white flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg transition duration-200"
            >
              Proceed to Checkout
            </Link>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
