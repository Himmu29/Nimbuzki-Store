import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Order from "@/models/Order";
import { Package, FolderTree, ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectToDatabase();

  const productCount = await Product.countDocuments();
  const categoryCount = await Category.countDocuments();
  const orderCount = await Order.countDocuments();

  // Calculate total revenue from paid orders
  const paidOrders = await Order.find({ paymentStatus: "paid" });
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

  const stats = [
    { name: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
    { name: "Total Orders", value: orderCount, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-100" },
    { name: "Total Products", value: productCount, icon: Package, color: "text-indigo-600", bg: "bg-indigo-100" },
    { name: "Categories", value: categoryCount, icon: FolderTree, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/products" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            Manage Products
          </Link>
          <Link href="/admin/orders" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
