import { notFound, redirect } from "next/navigation";
import { Box } from "@mui/material";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/getServerSession";
import { toClientTicket, toClientComment, toClientActivity } from "@/lib/ticketMapper";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminTicketDetail, { Agent } from "@/components/admin/AdminTicketDetail";

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/tickets");

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

  // Real departments come from the tickets themselves — there's no
  // dedicated Department table yet.
  const allTickets = await prisma.ticket.findMany({ select: { department: true } });
  const departments = Array.from(new Set(allTickets.map((t) => t.department)));

  // Now that User has a real `department` field, agents are scoped
  // to their actual department instead of being offered everywhere.
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", department: { not: null } },
    select: { id: true, userName: true, department: true },
    orderBy: { userName: "asc" },
  });

  const agentsByDepartment: Record<string, Agent[]> = departments.reduce(
    (acc, dept) => {
      acc[dept] = admins
        .filter((a) => a.department === dept)
        .map((a) => ({ id: a.id, name: a.userName }));
      return acc;
    },
    {} as Record<string, Agent[]>
  );

  return (
    <Box sx={{ flex: 1 }}>
      <AdminTopbar title={ticket.title} />
      <Box sx={{ p: 3 }}>
        <AdminTicketDetail
          ticket={toClientTicket(ticket)}
          initialComments={ticket.comments.map(toClientComment)}
          activity={ticket.activity.map(toClientActivity)}
          departments={departments}
          agentsByDepartment={agentsByDepartment}
        />
      </Box>
    </Box>
  );
}