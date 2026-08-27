import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { message, isInternal } = await request.json();
  if (!message || !message.trim()) {
    return NextResponse.json({ message: "Comment cannot be empty" }, { status: 400 });
  }

  if (session.role !== "ADMIN") {
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket || ticket.requesterId !== session.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  }

  // only staff can mark a note internal — customers never get that option
  const internal = session.role === "ADMIN" ? !!isInternal : false;

  const comment = await prisma.comment.create({
    data: {
      ticketId: id,
      authorId: session.userId,
      message: message.trim(),
      isInternal: internal,
    },
    include: { author: true },
  });

  return NextResponse.json({ comment }, { status: 201 });
}