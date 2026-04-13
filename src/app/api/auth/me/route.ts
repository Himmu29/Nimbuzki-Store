import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const authData = await getUserFromRequest(request);
    
    if (!authData) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectToDatabase();
    // Fetch fresh user data just to be safe, excluding password
    const user = await User.findById(authData.userId).select("-password");

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
