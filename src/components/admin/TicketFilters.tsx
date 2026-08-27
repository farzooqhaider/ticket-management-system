"use client";
import { Box, TextField, MenuItem, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { TicketStatus, TicketPriority } from "@/types/ticket";

export interface TicketFilterValues {
  search: string;
  status: TicketStatus | "all";
  priority: TicketPriority | "all";
  department: string; // "all" or a department name
}

interface TicketFiltersProps {
  values: TicketFilterValues;
  onChange: (values: TicketFilterValues) => void;
  departments: string[]; // list of department names to populate the dropdown
}

const statusOptions: { value: TicketStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "waiting_on_customer", label: "Waiting on customer" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const priorityOptions: { value: TicketPriority | "all"; label: string }[] = [
  { value: "all", label: "All priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export default function TicketFilters({ values, onChange, departments }: TicketFiltersProps) {
  // Small helper so each field only needs to say which key it's updating
  const update = (key: keyof TicketFilterValues, value: string) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 2 }}>
      <TextField
        size="small"
        placeholder="Search tickets..."
        value={values.search}
        onChange={(e) => update("search", e.target.value)}
        sx={{ flex: "1 1 220px" }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        select
        size="small"
        value={values.status}
        onChange={(e) => update("status", e.target.value)}
        sx={{ minWidth: 170 }}
      >
        {statusOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        value={values.priority}
        onChange={(e) => update("priority", e.target.value)}
        sx={{ minWidth: 150 }}
      >
        {priorityOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        value={values.department}
        onChange={(e) => update("department", e.target.value)}
        sx={{ minWidth: 170 }}
      >
        <MenuItem value="all">All departments</MenuItem>
        {departments.map((dept) => (
          <MenuItem key={dept} value={dept}>
            {dept}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
