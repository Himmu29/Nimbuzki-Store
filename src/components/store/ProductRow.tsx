import React from "react";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

type ProductRowProps = {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  products: any[];
  isLoading?: boolean;
};

export default function ProductRow({ title, subtitle, viewAllLink, products, isLoading = false }: ProductRowProps) {
  return (
    <section className="py-12 border-t border-gray-100 first:border-0">
      <SectionHeader title={title} subtitle={subtitle} viewAllLink={viewAllLink} />
      
      {isLoading ? (
        <div className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[260px] max-w-[320px] aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl shrink-0 snap-center"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
          <p className="text-gray-500 font-medium">No products found in this collection.</p>
        </div>
      ) : (
        <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 pt-2 snap-x hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-2">
          {products.map((product) => (
            <div key={product._id} className="snap-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
