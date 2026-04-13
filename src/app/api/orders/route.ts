import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Fetch orders only belonging to this specific user
    const orders = await Order.find({ user: user.userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { items, totalPrice, shippingAddress } = await request.json();
    
    if (!items || !items.length || !totalPrice || !shippingAddress) {
      return NextResponse.json({ error: "Missing required order fields" }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.create({
      user: user.userId,
      items,
      totalPrice,
      shippingAddress,
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    // Optionally clear the user's cart after successful order creation
    await Cart.findOneAndUpdate({ user: user.userId }, { items: [] });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
