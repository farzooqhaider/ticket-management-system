// components/admin/AdminTopbar.tsx
"use client";
import { Box, Typography, IconButton, Avatar, Tooltip } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";

export default function AdminTopbar({ title }: { title: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton size="small">
          <NotificationsNoneIcon fontSize="small" />
        </IconButton>
        <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: "primary.main" }}>AD</Avatar>
        <Tooltip title="Log out">
          <IconButton size="small" onClick={handleLogout}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}