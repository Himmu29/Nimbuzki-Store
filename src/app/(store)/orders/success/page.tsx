import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";

// For server components getting query params, we use searchParams
export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const orderId = searchParams.orderId as string | undefined;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full text-center relative overflow-hidden">
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-50 to-white -z-10"></div>

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6 mx-auto relative shadow-sm border-4 border-white">
          <CheckCircle className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-lg text-gray-500 mb-2">Thank you for shopping with Nimbuzki Store.</p>
        
        {orderId && (
          <div className="mt-6 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200 inline-flex items-center gap-3 text-left w-full mx-auto">
            <Package className="w-6 h-6 text-indigo-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Reference</p>
              <p className="font-mono text-sm text-gray-900">{orderId}</p>
            </div>
          </div>
        )}

        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          We've received your order and will begin processing it right away. You will receive an email confirmation shortly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            <Home className="w-5 h-5" /> Home
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            Continue Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
