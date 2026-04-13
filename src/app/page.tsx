import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeCollections from "@/components/store/HomeCollections";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-gray-100 bg-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-10 w-72 h-72 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-10 w-72 h-72 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">Shopping</span> Experience
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Discover a curated collection of premium FPV drone parts. Built with modern technology for a lightning-fast, secure, and beautiful journey from cart to home.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products" className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition duration-300 transform hover:-translate-y-1">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/categories" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition duration-300">
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic E-Commerce Collections */}
      <HomeCollections />

    </div>
  );
}
