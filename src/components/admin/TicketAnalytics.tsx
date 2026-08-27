"use client";
import { Box, Paper, Typography } from "@mui/material";
import {ResponsiveContainer,PieChart,Pie,Cell,Tooltip,BarChart,Bar,XAxis,YAxis,CartesianGrid,LineChart,Line,Legend} from "recharts";
import { Ticket, TicketStatus, TicketPriority } from "@/types/ticket";
import StatCard from "./StatCard";

interface TicketAnalyticsProps {
  tickets: Ticket[];
}

const statusLabels: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  waiting_on_customer: "Waiting on customer",
  resolved: "Resolved",
  closed: "Closed",
};

// Kept in sync with StatusBadge's palette so the chart colors mean the same
// thing everywhere in the app.
const statusColors: Record<TicketStatus, string> = {
  open: "#0288d1",
  in_progress: "#ed6c02",
  waiting_on_customer: "#9c27b0",
  resolved: "#2e7d32",
  closed: "#9e9e9e",
};

const priorityLabels: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const priorityColors: Record<TicketPriority, string> = {
  low: "#9e9e9e",
  medium: "#1976d2",
  high: "#ed6c02",
  urgent: "#d32f2f",
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, flex: "1 1 420px", minWidth: 320 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ height: 260 }}>{children}</Box>
    </Paper>
  );
}

export default function TicketAnalytics({ tickets }: TicketAnalyticsProps) {
  // --- Status breakdown ---
  const statusData = (Object.keys(statusLabels) as TicketStatus[])
    .map((status) => ({
      name: statusLabels[status],
      value: tickets.filter((t) => t.status === status).length,
      color: statusColors[status],
    }))
    .filter((d) => d.value > 0);

  // --- Priority breakdown ---
  const priorityData = (Object.keys(priorityLabels) as TicketPriority[]).map((priority) => ({
    name: priorityLabels[priority],
    value: tickets.filter((t) => t.priority === priority).length,
    color: priorityColors[priority],
  }));

  // --- Department breakdown ---
  const departments = Array.from(new Set(tickets.map((t) => t.department)));
  const departmentData = departments.map((dept) => ({
    name: dept,
    value: tickets.filter((t) => t.department === dept).length,
  }));

  // --- Volume over time (tickets created per day) ---
  const dateCounts = tickets.reduce<Record<string, number>>((acc, t) => {
    acc[t.createdAt] = (acc[t.createdAt] || 0) + 1;
    return acc;
  }, {});
  const volumeData = Object.entries(dateCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.slice(5), count })); // show as MM-DD

  // --- Top-line summary numbers ---
  const total = tickets.length;
  const openCount = tickets.filter((t) => t.status === "open").length;
  const urgentCount = tickets.filter((t) => t.priority === "urgent").length;
  const unassignedCount = tickets.filter((t) => !t.assigneeName).length;

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <StatCard label="Total tickets" value={total} />
        <StatCard label="Open" value={openCount} valueColor="info.main" />
        <StatCard label="Urgent" value={urgentCount} valueColor="error.main" />
        <StatCard label="Unassigned" value={unassignedCount} valueColor="warning.main" />
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <ChartCard title="Tickets by status">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tickets by priority">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tickets by department">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tickets created over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>
    </Box>
  );
}
