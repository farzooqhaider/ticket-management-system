import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { createSessionToken } from "@/lib/session";
import { loginSchema } from "@/schemas/loginSchema";

export async function POST(request: NextRequest) {
  try {
    // 1. Get request body
    const body = await request.json();

    // 2. Validate input
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // 3. Find user in database
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 4. Compare entered password with hashed password
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 5. Create JWT session token
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 6. Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });

    // 7. Store JWT in HttpOnly cookie
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}