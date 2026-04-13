import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { ShoppingCart } from "lucide-react";

export const revalidate = 60;

export default async function ProductsPage() {
  await connectToDatabase();
  const products = await Product.find({}).sort({ createdAt: -1 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl text-gray-900 font-extrabold tracking-tight mb-4">All Products</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          The finest collection of FPV Drone parts and accessories.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">No products found. Run the seed script!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
