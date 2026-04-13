import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");

  // If hitting an admin route, we must strictly verify the token and the role
  if (isAdminPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
      const { payload } = await jwtVerify(token, secret);
      
      // Check if user actually has an admin role
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      
    } catch (error) {
      // Token is invalid or expired
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
