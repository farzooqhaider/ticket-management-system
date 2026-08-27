"use client";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <DashboardIcon fontSize="small" /> },
  { label: "All tickets", href: "/admin/tickets", icon: <ConfirmationNumberIcon fontSize="small" /> },
  { label: "Departments", href: "/admin/departments", icon: <ApartmentIcon fontSize="small" /> },
  { label: "Users", href: "/admin/users", icon: <PeopleIcon fontSize="small" /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChartIcon fontSize="small" /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        borderRight: "1px solid",
        borderColor: "divider",
        minHeight: "100vh",
        py: 2,
        px: 1.5,
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 1, mb: 2 }}>
        TicketDesk
      </Typography>
      <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItemButton
              key={item.href}
              selected={isActive}
              onClick={() => router.push(item.href)}
              sx={{ borderRadius: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 34 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} sx={{ fontSize: 14 }} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
