"use client";

import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

export default function ProductForm({ 
  product, 
  categories, 
  onClose, 
  onSave 
}: { 
  product?: any, 
  categories: any[], 
  onClose: () => void, 
  onSave: () => void 
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    discountPrice: product?.discountPrice || "",
    stock: product?.stock || "",
    category: product?.category?._id || (categories.length > 0 ? categories[0]._id : ""),
    isFeatured: product?.isFeatured || false,
    images: product?.images || [], // existing images (URLs)
  });

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files));
    }
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let uploadedUrls: string[] = [];
      
      // Upload new files first if any
      if (newFiles.length > 0) {
        const uploadData = new FormData();
        newFiles.forEach(file => uploadData.append("files", file));
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.error || `Image upload failed (${uploadRes.status})`);
        }
        
        const uploadResult = await uploadRes.json();
        uploadedUrls = uploadResult.urls;
      }

      // Final image array
      const finalImages = [...formData.images, ...uploadedUrls];

      const payload = {
        ...formData,
        price: parseFloat(formData.price as string),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice as string) : undefined,
        stock: parseInt(formData.stock as string, 10),
        images: finalImages,
      };

      const url = product ? `/api/products/${product._id}` : "/api/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSave();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save product");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-10 z-50 p-4 overflow-y-auto">
     <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-900">
            {product ? "Edit Product" : "Add Product"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && <div className="mb-6 text-red-600 text-sm bg-red-50 p-4 rounded-xl font-medium">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
              <input
                type="number"
                name="price"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price ($)</label>
              <input
                type="number"
                name="discountPrice"
                step="0.01"
                value={formData.discountPrice}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
              <input
                type="number"
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition outline-none"
              >
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2 flex items-center gap-3 bg-indigo-50 p-4 rounded-xl">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-indigo-900 cursor-pointer">
                Featured Product (Show on Homepage)
              </label>
            </div>

            {/* Image Upload Section */}
            <div className="col-span-2 space-y-4">
              <label className="block text-sm font-medium text-gray-700">Images</label>
              
              {/* Existing Images */}
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {formData.images.map((img: string, idx: number) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 w-24 h-24">
                      <img src={img} alt="Product" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New File Input */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Upload className="h-8 w-8 mb-2 text-indigo-400" />
                  <p className="font-medium text-gray-700">Click to upload new images</p>
                  <p className="text-xs mt-1">Select multiple files to upload up to 4 images</p>
                  {newFiles.length > 0 && (
                    <div className="mt-4 flex gap-3 flex-wrap justify-center z-10 relative">
                      {newFiles.map((f, i) => (
                        <div key={i} className="relative rounded-lg overflow-hidden border border-gray-200 w-16 h-16 shadow-sm">
                          <img src={URL.createObjectURL(f)} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setNewFiles(prev => prev.filter((_, index) => index !== i));
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md opacity-80 hover:opacity-100 transition"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? (newFiles.length > 0 ? "Uploading & Saving..." : "Saving...") : (product ? "Update Product" : "Save Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
