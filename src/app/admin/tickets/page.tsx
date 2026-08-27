// app/admin/tickets/page.tsx
import { Box } from "@mui/material";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminTicketsView from "@/components/admin/AdminTicketsView";
import { prisma } from "@/lib/prisma";
import { toClientTicket } from "@/lib/ticketMapper";

export default async function AdminTicketsPage() {
  const tickets = await prisma.ticket.findMany({
    include: { requester: true, assignee: true },
    orderBy: { createdAt: "desc" },
  });

  const clientTickets = tickets.map(toClientTicket);
  const departments = Array.from(new Set(clientTickets.map((t) => t.department)));

  return (
    <Box sx={{ flex: 1 }}>
      <AdminTopbar title="All tickets" />
      <Box sx={{ p: 3 }}>
        <AdminTicketsView tickets={clientTickets} departments={departments} />
      </Box>
    </Box>
  );
}