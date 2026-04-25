"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

interface FeaturedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export default function FeaturedProducts({ categoryId, currentProductId }: FeaturedProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await fetch(`/api/products?category=${categoryId}`);
        if (res.ok) {
          const data = await res.json();
          // Filter out the current product and slice to 4-6 items
          const related = data.filter((p: any) => p._id !== currentProductId).slice(0, 6);
          setProducts(related);
        }
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setLoading(false);
      }
    }

    if (categoryId) {
      fetchRelated();
    }
  }, [categoryId, currentProductId]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-24 border-t border-gray-100 pt-16">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">You may also like</h2>
      <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4 xl:gap-6 scrollbar-hide">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
