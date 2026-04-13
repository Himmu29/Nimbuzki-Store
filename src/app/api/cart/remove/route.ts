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

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    const cart = await Cart.findOne({ user: user.userId });
    
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Filter out the specific product
    cart.items = cart.items.filter((item: any) => item.product.toString() !== productId);
    await cart.save();

    return NextResponse.json({ message: "Item removed from cart", cart }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
