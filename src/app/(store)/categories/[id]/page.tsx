import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default async function CategoryDetailPage({ params }: { params: { id: string } }) {
  await connectToDatabase();
  
  // Need to await params in Next.js 15+ but it works synchronusoy in <14 
  // Next 15 requires awaiting params
  const { id } = await params;

  const category = await Category.findById(id);
  if (!category) {
    notFound();
  }

  const products = await Product.find({ category: category._id }).sort({ createdAt: -1 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/categories" className="inline-flex items-center text-indigo-600 font-medium mb-8 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Categories
      </Link>
      
      <div className="mb-10">
        <h1 className="text-4xl text-gray-900 font-extrabold tracking-tight mb-2">
          {category.name}
        </h1>
        <p className="text-gray-500 text-lg">Found {products.length} products in this category.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">No products available in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {products.map((product) => (
            <Link key={product._id.toString()} href={`/products/${product._id}`} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">
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
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-extrabold text-indigo-600">${product.price.toFixed(2)}</span>
                  <div className="bg-gray-100 text-gray-900 p-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition">
                     <ShoppingCart className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
