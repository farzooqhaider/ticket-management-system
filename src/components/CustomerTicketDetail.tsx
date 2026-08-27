"use client";
import { useState } from "react";
import { Box, Paper, Typography, Stack } from "@mui/material";
import { Ticket, TicketComment, ActivityLogEntry } from "@/types/ticket";
import StatusBadge from "@/components/admin/StatusBadge";
import PriorityBadge from "@/components/admin/PriorityBadge";
import CommentThread from "@/components/admin/CommentThread";
import ActivityLog from "@/components/admin/ActivityLog";

interface CustomerTicketDetailProps {
  ticket: Ticket;
  initialComments: TicketComment[];
  activity: ActivityLogEntry[];
}

export default function CustomerTicketDetail({
  ticket,
  initialComments,
  activity,
}: CustomerTicketDetailProps) {
  const [comments, setComments] = useState(initialComments);

  const handleAddComment = async (message: string) => {
    const response = await fetch(`/api/tickets/${ticket.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) return; // CommentThread has no error slot yet; fails silently for now

    const { comment } = await response.json();
    setComments((prev) => [
      ...prev,
      {
        id: comment.id,
        author: "You",
        message: comment.message,
        createdAt: comment.createdAt.slice(0, 16).replace("T", " "),
        isInternal: false,
      },
    ]);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Stack direction="row" sx={{ mb: 1.5,justifycontent:"space-between",alignitems:"flex-start"  }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {ticket.title}
          </Typography>
          <StatusBadge status={ticket.status} />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 2 ,alignItems:"center"}} >
          <PriorityBadge priority={ticket.priority} />
          <Typography variant="body2" color="text.secondary">
            {ticket.department}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Opened {ticket.createdAt}
          </Typography>
        </Stack>
        <Typography variant="body2">{ticket.description}</Typography>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <CommentThread comments={comments} onAddComment={handleAddComment} />
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <ActivityLog entries={activity} />
      </Paper>
    </Box>
  );
}
