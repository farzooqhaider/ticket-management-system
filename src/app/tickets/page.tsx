
import { Box, Typography, Button } from "@mui/material";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/getServerSession";
import { toClientTicket } from "@/lib/ticketMapper";
import TicketTable from "@/components/TicketTable";

export default async function MyTicketsPage() {
  const session = await getServerSession();
  if (!session) return null; // middleware already redirects unauthenticated visitors here

  const tickets = await prisma.ticket.findMany({
    where: { requesterId: session.userId },
    include: { requester: true, assignee: true },
    orderBy: { createdAt: "desc" },
  });

  const clientTickets = tickets.map(toClientTicket);

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignitems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          My tickets
        </Typography>
        <Button href="/tickets/new" variant="contained">
          New ticket
        </Button>
      </Box>

      {clientTickets.length === 0 ? (
        <Typography color="text.secondary">
          You haven&apos;t submitted any tickets yet.
        </Typography>
      ) : (
        <TicketTable tickets={clientTickets} linkBase="/tickets" />
      )}
    </Box>
  );
}
