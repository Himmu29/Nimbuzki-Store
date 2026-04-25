"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders/all");
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, paymentStatus: string, orderStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus, orderStatus }),
      });
      if (res.ok) {
        // Optimistic UI update
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, paymentStatus, orderStatus } : o));
      } else {
        alert("Failed to update order");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-gray-500">{order._id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.user?.name || "Unknown"}</p>
                    <p className="text-xs text-gray-500">{order.user?.email || "No email"}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value, order.orderStatus)}
                      className={`text-xs font-medium px-2 py-1 rounded border outline-none cursor-pointer ${
                        order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 
                        order.paymentStatus === 'failed' ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order._id, order.paymentStatus, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded border outline-none cursor-pointer ${
                        order.orderStatus === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                        order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                        order.orderStatus === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
