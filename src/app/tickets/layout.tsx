// app/tickets/layout.tsx
import CustomerTopbar from "@/components/customer/customerTopBar";
import { Box } from "@mui/material";

export default function TicketsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <CustomerTopbar />
      {children}
    </Box>
  );
}