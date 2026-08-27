// app/admin/dashboard/page.tsx
import { Box } from "@mui/material";
import AdminTopbar from "@/components/admin/AdminTopbar";
import TicketAnalytics from "@/components/admin/TicketAnalytics";
import { prisma } from "@/lib/prisma";
import { toClientTicket } from "@/lib/ticketMapper";

export default async function DashboardPage() {
  const tickets = await prisma.ticket.findMany({
    include: { requester: true, assignee: true },
    orderBy: { createdAt: "desc" },
  });

  const clientTickets = tickets.map(toClientTicket);

  return (
    <Box sx={{ flex: 1 }}>
      <AdminTopbar title="Dashboard" />
      <Box sx={{ p: 3 }}>
        <TicketAnalytics tickets={clientTickets} />
      </Box>
    </Box>
  );
}