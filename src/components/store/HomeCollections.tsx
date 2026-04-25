"use client";

import React, { useEffect, useState } from "react";
import ProductRow from "./ProductRow";

export default function HomeCollections() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories")
        ]);

        if (prodRes.ok && catRes.ok) {
          const prods = await prodRes.json();
          const cats = await catRes.json();
          setProducts(prods);
          setCategories(cats);
        }
      } catch (err) {
        console.error("Failed to fetch collections", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter deals of the day
  const dealsOfTheDay = products.filter(p => p.isFeatured).slice(0, 6);

  // Helper to extract category products
  const getCategoryProducts = (categoryName: string) => {
    const cat = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    if (!cat) return { catId: "", products: [] };
    
    // API sometimes populates category as an object { _id, name }, sometimes as a string ID.
    // Need to safely check both.
    const catProducts = products.filter(p => 
      p.category && (p.category === cat._id || p.category._id === cat._id)
    ).slice(0, 6);

    return { catId: cat._id, products: catProducts };
  };

  const frames = getCategoryProducts("Frames");
  const motors = getCategoryProducts("Motors");
  const cameras = getCategoryProducts("Cameras");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <ProductRow 
        title="Deal of the Day" 
        subtitle="Incredible discounts on premium gear, updated daily."
        products={dealsOfTheDay} 
        isLoading={isLoading} 
      />

      <ProductRow 
        title="Frames Collection" 
        viewAllLink={frames.catId ? `/categories/${frames.catId}` : undefined}
        products={frames.products} 
        isLoading={isLoading} 
      />

      <ProductRow 
        title="Motors Collection" 
        viewAllLink={motors.catId ? `/categories/${motors.catId}` : undefined}
        products={motors.products} 
        isLoading={isLoading} 
      />

      <ProductRow 
        title="Cameras Collection" 
        viewAllLink={cameras.catId ? `/categories/${cameras.catId}` : undefined}
        products={cameras.products} 
        isLoading={isLoading} 
      />

    </div>
  );
}
