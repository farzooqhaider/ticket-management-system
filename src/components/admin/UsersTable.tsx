"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import RoleBadge from "./RoleBagde";
import AssignStaffDialog from "./AssignStaffDialog";

export interface AdminUserRow {
  id: string;
  userName: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  department: string | null;
  createdAt: string;
  ticketsRequestedCount: number;
  ticketsAssignedCount: number;
}

export default function UsersTable({
  users,
  departments,
}: {
  users: AdminUserRow[];
  departments: string[];
}) {
  const [activeUser, setActiveUser] = useState<AdminUserRow | null>(null);

  return (
    <>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell align="right">Tickets filed</TableCell>
              <TableCell align="right">Tickets assigned</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>{u.userName}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <RoleBadge role={u.role} />
                </TableCell>
                <TableCell>
                  {u.department ?? (
                    <Typography variant="caption" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">{u.ticketsRequestedCount}</TableCell>
                <TableCell align="right">{u.ticketsAssignedCount}</TableCell>
                <TableCell>{u.createdAt}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => setActiveUser(u)}>
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {activeUser && (
        <AssignStaffDialog
          open={!!activeUser}
          onClose={() => setActiveUser(null)}
          userId={activeUser.id}
          userName={activeUser.userName}
          currentRole={activeUser.role}
          currentDepartment={activeUser.department}
          departments={departments}
        />
      )}
    </>
  );
}