import { Box, Paper, Typography, TextField, MenuItem, Stack } from "@mui/material";
import { TicketStatus, TicketPriority } from "@/types/ticket";

interface TicketSidebarProps {
  status: TicketStatus;
  onStatusChange: (status: TicketStatus) => void;
  priority: TicketPriority;
  onPriorityChange: (priority: TicketPriority) => void;
  department: string;
  onDepartmentChange: (department: string) => void;
  assignee: string | null;
  onAssigneeChange: (assignee: string) => void;
  departments: string[];
  availableAgents: Agent[];
}

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "waiting_on_customer", label: "Waiting on customer" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const priorityOptions: { value: TicketPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];
export interface Agent {
  id: string;
  name: string;
}
export default function TicketSidebar({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  department,
  onDepartmentChange,
  assignee,
  onAssigneeChange,
  departments,
  availableAgents,
}: TicketSidebarProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Status
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as TicketStatus)}
            sx={{ mt: 0.5 }}
          >
            {statusOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Priority
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as TicketPriority)}
            sx={{ mt: 0.5 }}
          >
            {priorityOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Department
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            sx={{ mt: 0.5 }}
          >
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Assigned agent
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={assignee || ""}
            onChange={(e) => onAssigneeChange(e.target.value)}
            sx={{ mt: 0.5 }}
            disabled={availableAgents.length === 0}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {availableAgents.map((agent) => (
              <MenuItem key={agent.id} value={agent.id}>
                {agent.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Stack>
    </Paper>
  );
}