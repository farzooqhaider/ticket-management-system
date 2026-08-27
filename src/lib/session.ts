import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";


const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in .env");
}

const secret = new TextEncoder().encode(jwtSecret);

export const SESSION_COOKIE_NAME = "session";

export type Role = "ADMIN" | "CUSTOMER";

export interface SessionPayload {
  userId: string;
  email: string;
  role: Role;
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// For use inside API route handlers (app/api/**/route.ts)
export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
