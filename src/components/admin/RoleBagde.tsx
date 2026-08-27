import { Chip } from "@mui/material";

export default function RoleBadge({ role }: { role: "ADMIN" | "CUSTOMER" }) {
  return (
    <Chip
      size="small"
      label={role === "ADMIN" ? "Admin" : "Customer"}
      color={role === "ADMIN" ? "primary" : "default"}
      variant={role === "ADMIN" ? "filled" : "outlined"}
    />
  );
}