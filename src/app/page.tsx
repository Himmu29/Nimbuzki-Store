import Link from "next/link";
import { ShoppingBag, ArrowRight, Star, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar Placeholder */}
      <nav className="fixed w-full backdrop-blur-md bg-white/70 border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 p-2 rounded-xl">
                <ShoppingBag className="text-white h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-brand-900">Nimbuzki</span>
            </div>
            <div className="flex gap-4">
              <Link href="/admin" className="text-sm font-medium hover:text-brand-600 transition-colors">Admin Panel</Link>
              <Link href="/cart" className="text-sm font-medium hover:text-brand-600 transition-colors">Cart (0)</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-10 w-72 h-72 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500">Shopping</span> Experience
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Discover a curated collection of premium products. Built with modern technology for a lightning-fast, secure, and beautiful journey from cart to home.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/products" className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-brand-600 border border-transparent rounded-full shadow-sm hover:bg-brand-500 transition-all duration-300 transform hover:scale-105">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/categories" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-brand-700 bg-brand-50 border border-brand-200 rounded-full hover:bg-brand-100 transition-all duration-300">
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <Zap className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Powered by Next.js App Router for instant page transitions and optimal performance.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="h-10 w-10 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure Checkout</h3>
              <p className="text-gray-600">State of the art JWT-based authentication combined with secure API routing.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <Star className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">A dynamic and gorgeous user interface to showcase our products gracefully.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
