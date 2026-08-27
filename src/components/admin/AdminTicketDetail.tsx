// components/admin/AdminTicketDetail.tsx
"use client";
import { useState } from "react";
import { Box, Paper, Typography, Stack, Grid } from "@mui/material";
import { Ticket, TicketComment, ActivityLogEntry, TicketStatus, TicketPriority } from "@/types/ticket";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import CommentThread from "./CommentThread";
import ActivityLog from "./ActivityLog";
import TicketSidebar from "./TicketSidebar";

export interface Agent {
  id: string;
  name: string;
}
interface AdminTicketDetailProps {
  ticket: Ticket;
  initialComments: TicketComment[];
  activity: ActivityLogEntry[];
  departments: string[];
  agentsByDepartment: Record<string, Agent[]>;
}

export default function AdminTicketDetail({
  ticket,
  initialComments,
  activity,
  departments,
  agentsByDepartment,
}: AdminTicketDetailProps) {
  const [comments, setComments] = useState(initialComments);
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [department, setDepartment] = useState(ticket.department);
  const [assignee, setAssignee] = useState<string | null>(ticket.assigneeId);

  const patchTicket = async (body: Record<string, unknown>) => {
    const response = await fetch(`/api/tickets/${ticket.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.ok;
  };

  const handleStatusChange = async (next: TicketStatus) => {
    setStatus(next);
    await patchTicket({ status: next.toUpperCase() });
  };

  const handlePriorityChange = async (next: TicketPriority) => {
    setPriority(next);
    await patchTicket({ priority: next.toUpperCase() });
  };

  const handleDepartmentChange = async (next: string) => {
    setDepartment(next);
    setAssignee(null); // matches TicketSidebar's comment: old assignee may not belong to new dept
    await patchTicket({ department: next, assigneeId: null });
  };

  const handleAssigneeChange = async (next: string) => {
    setAssignee(next || null);
    // NOTE: assigneeId here needs a real user id, not a name — see caveat below
    await patchTicket({ assigneeId: next || null });
  };

  const handleAddComment = async (message: string, isInternal = false) => {
    const response = await fetch(`/api/tickets/${ticket.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, isInternal }),
    });
    if (!response.ok) return;
    const { comment } = await response.json();
    setComments((prev) => [
      ...prev,
      {
        id: comment.id,
        author: "You",
        message: comment.message,
        createdAt: comment.createdAt.slice(0, 16).replace("T", " "),
        isInternal: comment.isInternal,
      },
    ]);
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Stack direction="row" sx={{ mb: 1.5, justifycontent: "space-between", alignitems: "flex-start" }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {ticket.title}
            </Typography>
            <StatusBadge status={status} />
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 2, alignitems: "center" }}>
            <PriorityBadge priority={priority} />
            <Typography variant="body2" color="text.secondary">
              {department}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Opened {ticket.createdAt} by {ticket.requesterName}
            </Typography>
          </Stack>
          <Typography variant="body2">{ticket.description}</Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <CommentThread comments={comments} onAddComment={(msg) => handleAddComment(msg)} />
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <ActivityLog entries={activity} />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}  >
        <TicketSidebar
          status={status}
          onStatusChange={handleStatusChange}
          priority={priority}
          onPriorityChange={handlePriorityChange}
          department={department}
          onDepartmentChange={handleDepartmentChange}
          assignee={assignee}
          onAssigneeChange={handleAssigneeChange}
          departments={departments}
          availableAgents={agentsByDepartment[department] ?? []}
        />
      </Grid>
    </Grid>
  );
}