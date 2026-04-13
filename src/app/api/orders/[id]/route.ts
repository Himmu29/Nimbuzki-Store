import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { getUserFromRequest } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { paymentStatus, orderStatus } = await request.json();
    
    // We only want admins to update fulfillment statuses through this vector
    const updatePayload: any = {};
    if (paymentStatus) updatePayload.paymentStatus = paymentStatus;
    if (orderStatus) updatePayload.orderStatus = orderStatus;

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: "No valid status fields provided" }, { status: 400 });
    }

    await connectToDatabase();
    
    const updated = await Order.findByIdAndUpdate(params.id, updatePayload, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
