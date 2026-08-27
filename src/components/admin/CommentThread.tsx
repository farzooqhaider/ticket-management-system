"use client";
import { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Chip, Stack } from "@mui/material";
import { TicketComment } from "@/types/ticket";

interface CommentThreadProps {
  comments: TicketComment[];
  onAddComment: (message: string) => void;
}

export default function CommentThread({ comments, onAddComment }: CommentThreadProps) {
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    if (!draft.trim()) return; // don't submit empty comments
    onAddComment(draft.trim());
    setDraft("");
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
        Conversation
      </Typography>

      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {comments.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No comments yet.
          </Typography>
        )}
        {comments.map((comment) => (
          <Paper
            key={comment.id}
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: comment.isInternal ? "warning.50" : "background.paper",
              borderColor: comment.isInternal ? "warning.light" : "divider",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {comment.author}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                {comment.isInternal && (
                  <Chip label="Internal note" size="small" color="warning" variant="outlined" />
                )}
                <Typography variant="caption" color="text.secondary">
                  {comment.createdAt}
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="body2">{comment.message}</Typography>
          </Paper>
        ))}
      </Stack>

      <TextField
        fullWidth
        multiline
        minRows={2}
        placeholder="Add a comment..."
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <Button variant="contained" size="small" sx={{ mt: 1 }} onClick={handleSend}>
        Post comment
      </Button>
    </Box>
  );
}
