import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import { FolderGit2, ArrowRight } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

export default async function CategoriesPage() {
  await connectToDatabase();
  const categories = await Category.find({}).sort({ name: 1 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl text-gray-900 font-extrabold tracking-tight mb-4">Browse Categories</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          Explore our wide range of premium drone parts and accessories, sorted beautifully just for you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat._id.toString()}
            href={`/categories/${cat._id}`}
            className="group flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-100 transition duration-300 transform hover:-translate-y-1"
          >
            <div className="bg-indigo-50 text-indigo-600 p-4 rounded-full mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
              <FolderGit2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition">{cat.name}</h2>
            <div className="mt-4 flex items-center text-sm font-medium text-indigo-500 opacity-0 group-hover:opacity-100 transition">
              View Products <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
