import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hashed: string) => {
  return await bcrypt.compare(password, hashed);
};

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const getUserFromRequest = async (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload; // { userId, role }
  } catch (err) {
    return null;
  }
};
