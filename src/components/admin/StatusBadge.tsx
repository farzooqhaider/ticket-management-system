import { Chip } from "@mui/material";
import { TicketStatus } from "@/types/ticket";

// Central place mapping each status to a label + color.
// Change a status's color here and it updates everywhere the badge is used.
const statusConfig: Record<
  TicketStatus,
  { label: string; color: "info" | "warning" | "secondary" | "success" | "default" }
> = {
  open: { label: "Open", color: "info" },
  in_progress: { label: "In progress", color: "warning" },
  waiting_on_customer: { label: "Waiting on customer", color: "secondary" },
  resolved: { label: "Resolved", color: "success" },
  closed: { label: "Closed", color: "default" },
};

export default function StatusBadge({ status }: { status: TicketStatus }) {
  const config = statusConfig[status];
  return <Chip label={config.label} color={config.color} size="small" />;
}
