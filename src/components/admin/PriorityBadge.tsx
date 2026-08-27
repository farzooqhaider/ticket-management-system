import { Typography } from "@mui/material";
import { TicketPriority } from "@/types/ticket";

// Priority is shown as colored text rather than a filled chip,
// so it reads as a "level" rather than a "state" (that's StatusBadge's job).
const priorityColor: Record<TicketPriority, string> = {
  low: "text.secondary",
  medium: "text.primary",
  high: "warning.main",
  urgent: "error.main",
};

const priorityLabel: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export default function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <Typography variant="body2" sx={{ color: priorityColor[priority], fontWeight: 500 }}>
      {priorityLabel[priority]}
    </Typography>
  );
}
