import { Box, Grid, Paper, Typography, Chip, Divider } from "@mui/material";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { prisma } from "@/lib/prisma";

export default async function DepartmentsPage() {
  const tickets = await prisma.ticket.findMany({
    select: { department: true, status: true, priority: true, assigneeId: true },
  });

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { userName: true, department: true },
  });

  const departments = Array.from(new Set(tickets.map((t) => t.department))).sort();

  const stats = departments.map((dept) => {
    const deptTickets = tickets.filter((t) => t.department === dept);
    const deptStaff = admins.filter((a) => a.department === dept);
    return {
      name: dept,
      total: deptTickets.length,
      open: deptTickets.filter((t) => t.status === "OPEN").length,
      urgent: deptTickets.filter((t) => t.priority === "URGENT").length,
      unassigned: deptTickets.filter((t) => !t.assigneeId).length,
      staff: deptStaff.map((s) => s.userName),
    };
  });

  const unassignedStaffCount = admins.filter((a) => !a.department).length;

  return (
    <Box sx={{ flex: 1 }}>
      <AdminTopbar title="Departments" />
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {departments.length} departments · {admins.length} staff accounts total
          {unassignedStaffCount > 0 && ` · ${unassignedStaffCount} staff not assigned to a department`}
        </Typography>

        {departments.length === 0 ? (
          <Typography color="text.secondary">No tickets yet, so no departments to show.</Typography>
        ) : (
          <Grid container spacing={2}>
            {stats.map((dept) => (
              <Grid key={dept.name} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                    {dept.name}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                    <Chip size="small" label={`${dept.total} total`} />
                    <Chip size="small" color="info" label={`${dept.open} open`} />
                    <Chip size="small" color="error" label={`${dept.urgent} urgent`} />
                    <Chip size="small" color="warning" label={`${dept.unassigned} unassigned`} />
                  </Box>
                  <Divider sx={{ mb: 1.5 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                    Staff ({dept.staff.length})
                  </Typography>
                  {dept.staff.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No staff assigned to this department yet.
                    </Typography>
                  ) : (
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {dept.staff.map((name) => (
                        <Chip key={name} size="small" variant="outlined" label={name} />
                      ))}
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}