"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";

interface AssignStaffDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  currentRole: "ADMIN" | "CUSTOMER";
  currentDepartment: string | null;
  departments: string[];
}

export default function AssignStaffDialog({
  open,
  onClose,
  userId,
  userName,
  currentRole,
  currentDepartment,
  departments,
}: AssignStaffDialogProps) {
  const [role, setRole] = useState<"ADMIN" | "CUSTOMER">(currentRole);
  const [department, setDepartment] = useState(currentDepartment ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarSeverity, setSnackBarSeverity] = useState<"success" | "error">("success");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (role === "ADMIN" && !department) {
      setError("Please select a department");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, department: role === "ADMIN" ? department : null }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSnackBarSeverity("error");
        setSnackBarMessage(result.message || "Could not update user");
        setOpenSnackBar(true);
        setSubmitting(false);
        return;
      }

      setSnackBarSeverity("success");
      setSnackBarMessage("User updated");
      setOpenSnackBar(true);
      setSubmitting(false);
      onClose();
      router.refresh();
    } catch {
      setSnackBarSeverity("error");
      setSnackBarMessage("Could not reach the server. Please try again.");
      setOpenSnackBar(true);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Manage {userName}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => {
                const next = e.target.value as "ADMIN" | "CUSTOMER";
                setRole(next);
                if (next === "CUSTOMER") setDepartment("");
              }}
            >
              <MenuItem value="CUSTOMER">Customer</MenuItem>
              <MenuItem value="ADMIN">Staff (Admin)</MenuItem>
            </Select>
          </FormControl>

          {role === "ADMIN" && (
            <FormControl fullWidth margin="normal" error={!!error}>
              <InputLabel>Department</InputLabel>
              <Select value={department} label="Department" onChange={(e) => setDepartment(e.target.value)}>
                {departments.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
              <Typography color="error" variant="caption">
                {error}
              </Typography>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={() => setOpenSnackBar(false)}>
        <Alert severity={snackBarSeverity} variant="filled" onClose={() => setOpenSnackBar(false)}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}