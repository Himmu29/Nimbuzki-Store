"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/contexts/CartContext";
import { CheckCircle2, ShieldCheck, CreditCard, Loader2 } from "lucide-react";

function CheckoutContent() {
  const { cart, clearCartData } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const directProductId = searchParams.get("productId");
  const directQuantity = parseInt(searchParams.get("quantity") || "1", 10);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [directItem, setDirectItem] = useState<any>(null);
  const [loadingDirect, setLoadingDirect] = useState(!!directProductId);

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
  });

  useEffect(() => {
    let isMounted = true;
    if (directProductId) {
      fetch(`/api/products/${directProductId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (isMounted) {
            if (data && !data.error) {
              setDirectItem({
                product: data,
                quantity: directQuantity
              });
            }
            setLoadingDirect(false);
          }
        })
        .catch(err => {
          console.error("Failed to fetch direct product:", err);
          if (isMounted) setLoadingDirect(false);
        });
    }
    return () => { isMounted = false; };
  }, [directProductId, directQuantity]);

  const itemsToCheckout = useMemo(() => {
    if (directItem) return [directItem];
    return cart?.items || [];
  }, [directItem, cart]);

  const subtotal = useMemo(() => {
    return itemsToCheckout.reduce((total: number, item: any) => {
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  }, [itemsToCheckout]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (itemsToCheckout.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = itemsToCheckout.map((item: any) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.discountPrice || item.product.price,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          totalPrice: subtotal,
          shippingAddress: formData,
        }),
      });

      if (res.ok) {
        // Order placed successfully
        const orderData = await res.json();
        if (!directItem) {
          clearCartData(); // Clean up context state if it was a cart order
        }
        router.push(`/orders/success?orderId=${orderData._id}`);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to place order.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingDirect) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500 font-medium">Preparing checkout...</p>
      </div>
    );
  }

  // Redirect if empty trying to checkout
  if (itemsToCheckout.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <button onClick={() => router.push("/")} className="text-indigo-600 font-medium hover:underline">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Secure Checkout</h1>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      )}

      <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
        
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
            
            {/* Shipping Info */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Shipping Address
              </h2>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input type="text" id="street" name="street" required value={formData.street} onChange={handleInputChange}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-3" />
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" id="city" name="city" required value={formData.city} onChange={handleInputChange}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-3" />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
                  <input type="text" id="state" name="state" required value={formData.state} onChange={handleInputChange}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-3" />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input type="text" id="postalCode" name="postalCode" required value={formData.postalCode} onChange={handleInputChange}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-3" />
                </div>
              </div>
            </div>

            {/* Payment Simulation */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Payment Method
              </h2>
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-green-600 mt-0.5" />
                <div>
                  <p className="font-bold text-green-800">Automatic Approval Mode</p>
                  <p className="text-sm text-green-700 mt-1">For this demo, no credit card is required. Simply place your order and it will be approved automatically.</p>
                </div>
              </div>
            </div>
            
          </form>
        </div>

        {/* Order Summary sidebar */}
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="bg-gray-900 text-white rounded-3xl shadow-xl p-8 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Review Order</h2>
            
            <ul className="divide-y divide-gray-800 border-b border-gray-800 pb-6 mb-6">
              {itemsToCheckout.map((item: any) => (
                <li key={item.product._id} className="py-4 flex gap-4">
                  <div className="h-16 w-16 bg-white rounded-xl overflow-hidden flex-shrink-0 p-1">
                     {item.product.images && item.product.images.length > 0 ? (
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-bold truncate max-w-[150px]">{item.product.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex flex-col justify-center text-right">
                    <p className="font-bold">
                      ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="space-y-3 text-sm text-gray-300">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>Free Setup</dd>
              </div>
              <div className="border-t border-gray-800 pt-4 mt-4 flex justify-between items-center text-white">
                <dt className="text-base font-bold">Total Due</dt>
                <dd className="text-2xl font-extrabold text-indigo-400">${subtotal.toFixed(2)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full mt-8 bg-indigo-600 flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-bold text-lg hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 transition duration-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <> <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing... </>
              ) : (
                <> <CheckCircle2 className="w-6 h-6" /> Place Order </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading checkout...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
