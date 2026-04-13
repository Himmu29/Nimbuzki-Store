import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Cart from "@/models/Cart";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Automatically fetch or create a cart for this user
    let cart = await Cart.findOne({ user: user.userId }).populate("items.product");
    
    if (!cart) {
      cart = await Cart.create({ user: user.userId, items: [] });
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
