// components/CustomerTopbar.tsx
"use client";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerTopbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>TicketDesk</Typography>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Button component={Link} href="/tickets" size="small">My tickets</Button>
        <Button component={Link} href="/tickets/new" size="small" variant="contained">New ticket</Button>
        <Button size="small" onClick={handleLogout}>Log out</Button>
      </Box>
    </Box>
  );
}