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

    const { productId, quantity = 1 } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    let cart = await Cart.findOne({ user: user.userId });
    if (!cart) {
      cart = new Cart({ user: user.userId, items: [] });
    }

    // Check if item already exists to increment quantity
    const existingItemIndex = cart.items.findIndex((item: any) => item.product.toString() === productId);
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return NextResponse.json({ message: "Item added to cart", cart }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
