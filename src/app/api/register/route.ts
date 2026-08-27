import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/schemas/registerSchema";

export async function POST(request: NextRequest) {
  
  const body = await request.json();

  
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid data", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { userName, email, phone, country, gender, password } = parsed.data;


  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        userName,
        email,
        phone,
        country,
        gender,
        password: hashedPassword,
      },
      select: {
        id: true,
        userName: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    const err = error as { code?: string; message?: string };
     if (err?.code === "P2002") {
    return NextResponse.json(
      { message: "An account with this email already exists" },
      { status: 409 }
    );
  }

    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}