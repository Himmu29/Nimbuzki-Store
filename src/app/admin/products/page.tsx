"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import ProductForm from "./ProductForm";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories")
      ]);
      
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
      else alert("Failed to delete");
    } catch (err) {
      console.error(err);
    }
  };

  const openForm = (product: any = null) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => openForm()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium w-20">Image</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((prod) => (
                <tr key={prod._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                      {prod.images && prod.images.length > 0 ? (
                        <img src={prod.images[0]} alt={prod.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-[10px] text-gray-400">No Img</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{prod.name}</p>
                    {prod.isFeatured && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">Featured</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{prod.category?.name || "Unknown"}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ${prod.price.toFixed(2)}
                    {prod.discountPrice && <span className="block text-xs text-green-600">Sale: ${prod.discountPrice.toFixed(2)}</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prod.stock > 10 ? 'bg-green-100 text-green-800' : prod.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {prod.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openForm(prod)} className="text-blue-600 hover:text-blue-800 transition">
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(prod._id)} className="text-red-600 hover:text-red-800 transition">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <ProductForm 
          product={editingProduct} 
          categories={categories} 
          onClose={closeForm} 
          onSave={() => { closeForm(); fetchData(); }} 
        />
      )}
    </div>
  );
}
