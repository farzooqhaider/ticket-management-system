import { Box } from "@mui/material";
import AdminTopbar from "@/components/admin/AdminTopbar";
import UsersTable from "@/components/admin/UsersTable";
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { ticketsRequested: true, ticketsAssigned: true } },
    },
  });

  const rows = users.map((u) => ({
    id: u.id,
    userName: u.userName,
    email: u.email,
    role: u.role,
    department: u.department,
    createdAt: u.createdAt.toISOString().slice(0, 10),
    ticketsRequestedCount: u._count.ticketsRequested,
    ticketsAssignedCount: u._count.ticketsAssigned,
  }));

  const tickets = await prisma.ticket.findMany({ select: { department: true } });
  const departments = Array.from(new Set(tickets.map((t) => t.department))).sort();

  return (
    <Box sx={{ flex: 1 }}>
      <AdminTopbar title="Users" />
      <Box sx={{ p: 3 }}>
        <UsersTable users={rows} departments={departments} />
      </Box>
    </Box>
  );
}