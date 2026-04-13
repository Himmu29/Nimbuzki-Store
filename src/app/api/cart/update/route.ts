import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Cart from "@/models/Cart";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();
    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: "Product ID and explicit quantity are required" }, { status: 400 });
    }

    await connectToDatabase();
    const cart = await Cart.findOne({ user: user.userId });
    
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (quantity <= 0) {
      // If quantity is zero or less, just remove it entirely
      cart.items = cart.items.filter((item: any) => item.product.toString() !== productId);
    } else {
      const existingItemIndex = cart.items.findIndex((item: any) => item.product.toString() === productId);
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity = quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    return NextResponse.json({ message: "Cart updated", cart }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
