import { Box, Typography, Stack } from "@mui/material";
import { ActivityLogEntry } from "@/types/ticket";

export default function ActivityLog({ entries }: { entries: ActivityLogEntry[] }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
        Activity
      </Typography>
      <Stack spacing={1.25}>
        {entries.map((entry) => (
          <Box key={entry.id} sx={{ borderLeft: "2px solid", borderColor: "divider", pl: 1.5 }}>
            <Typography variant="body2">{entry.action}</Typography>
            <Typography variant="caption" color="text.secondary">
              {entry.actor} · {entry.timestamp}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
