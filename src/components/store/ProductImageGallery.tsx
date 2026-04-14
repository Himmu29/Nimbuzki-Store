"use client";

import { useState } from "react";
import { Box } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 relative shadow-sm flex items-center justify-center text-gray-400">
        <Box className="w-24 h-24 text-gray-200" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 relative shadow-sm">
        <img
          src={images[activeIndex]}
          alt={`${productName} view ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                activeIndex === index ? "border-indigo-600 shadow-md scale-105" : "border-gray-200 opacity-70 hover:opacity-100"
              }`}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
