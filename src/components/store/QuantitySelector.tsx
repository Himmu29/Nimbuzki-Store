"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  max?: number;
}

export default function QuantitySelector({ quantity, onIncrement, onDecrement, max }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-semibold text-gray-700">Quantity</span>
      <div className="flex items-center bg-gray-100 rounded-xl p-1">
        <button
          onClick={onDecrement}
          disabled={quantity <= 1}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
        <button
          onClick={onIncrement}
          disabled={max !== undefined && quantity >= max}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
