import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    // Support optional category filtering via query param
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const query = category ? { category } : {};
    // Populate category reference for nicer frontend displays
    const products = await Product.find(query).populate("category").sort({ createdAt: -1 });

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, category, stock, images, specifications } = body;

    // Basic validation
    if (!name || !description || price === undefined || !category || stock === undefined) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    await connectToDatabase();
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: images || [],
      specifications: specifications || {},
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
