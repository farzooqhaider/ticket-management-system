import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ticketSchema } from "@/schemas/ticketSchema";
import { getSessionFromRequest } from "@/lib/session";
import type { TicketPriority as PrismaPriority } from "../../../../generated/prisma/client";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // admins see every ticket; customers only ever see their own
  const tickets = await prisma.ticket.findMany({
    where: session.role === "ADMIN" ? {} : { requesterId: session.userId },
    include: { requester: true, assignee: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ tickets }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = ticketSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid data", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { title, description, category, priority, department } = parsed.data;

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      category,
      priority: priority.toUpperCase() as PrismaPriority,
      department,
      requesterId: session.userId, // ticket is always tied to whoever is logged in — never trust a client-supplied id
      activity: {
        create: { action: "Ticket created", actor: session.email },
      },
    },
  });

  return NextResponse.json({ message: "Ticket submitted", ticket }, { status: 201 });
}
