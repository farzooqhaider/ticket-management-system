import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";
import { staffAssignSchema } from "@/schemas/staffAssignSchema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getSessionFromRequest(request);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = staffAssignSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid data", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { role, department } = parsed.data;

  const user = await prisma.user.update({
    where: { id },
    data: {
      role,
      department: role === "ADMIN" ? department : null, // customers never carry a department
    },
    select: { id: true, userName: true, role: true, department: true },
  });

  return NextResponse.json({ message: "User updated", user }, { status: 200 });
}