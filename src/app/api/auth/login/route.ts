import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { verifyPassword } from "@/lib/auth";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fixed Admin Credentials Check
    const adminCreds = process.env.ADMIN_CREDENTIALS;
    if (adminCreds) {
      const adminPairs = adminCreds.split(",");
      for (const pair of adminPairs) {
        const [adminEmail, adminPass] = pair.split(":");
        if (email === adminEmail && password === adminPass) {
          const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
          const token = await new SignJWT({ userId: "admin-fixed", role: "admin" })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(secret);

          const response = NextResponse.json({ message: "Admin Login successful", role: "admin" }, { status: 200 });
          response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
          return response;
        }
      }
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create edge-compatible JWT using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
    const token = await new SignJWT({ userId: user._id.toString(), role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({ message: "Login successful", role: user.role }, { status: 200 });
    
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
