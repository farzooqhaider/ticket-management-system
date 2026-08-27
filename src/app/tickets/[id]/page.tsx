import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/getServerSession";
import { toClientTicket, toClientComment, toClientActivity } from "@/lib/ticketMapper";
import CustomerTicketDetail from "@/components/CustomerTicketDetail";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession();
  if (!session) redirect("/login");

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      requester: true,
      assignee: true,
      comments: { orderBy: { createdAt: "asc" }, include: { author: true } },
      activity: { orderBy: { timestamp: "asc" } },
    },
  });

  if (!ticket) notFound();
  if (ticket.requesterId !== session.userId) redirect("/tickets");

  return (
    <CustomerTicketDetail
      ticket={toClientTicket(ticket)}
      initialComments={ticket.comments.filter((c) => !c.isInternal).map(toClientComment)}
      activity={ticket.activity.map(toClientActivity)}
    />
  );
}