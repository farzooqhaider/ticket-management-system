import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";
import type { TicketStatus as PrismaStatus } from "../../../../../generated/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      requester: true,
      assignee: true,
      comments: { orderBy: { createdAt: "asc" }, include: { author: true } },
      activity: { orderBy: { timestamp: "asc" } },
    },
  });

  if (!ticket) {
    return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
  }

  // customers can only open their own tickets
  if (session.role !== "ADMIN" && ticket.requesterId !== session.userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  // internal notes are staff-only, strip them out for customers
  const comments =
    session.role === "ADMIN" ? ticket.comments : ticket.comments.filter((c) => !c.isInternal);

  return NextResponse.json({ ticket: { ...ticket, comments } }, { status: 200 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getSessionFromRequest(request);
  // status/department/assignee changes are staff actions only
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { status, department, assigneeId } = body as {
    status?: PrismaStatus;
    department?: string;
    assigneeId?: string | null;
  };

  const ticket = await prisma.ticket.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(department && { department }),
      ...(assigneeId !== undefined && { assigneeId }),
      activity: {
        create: { action: "Ticket updated", actor: session.email },
      },
    },
  });

  return NextResponse.json({ ticket }, { status: 200 });
}