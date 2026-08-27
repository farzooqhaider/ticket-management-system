"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ticketSchema, TicketFormData } from "@/schemas/ticketSchema";

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

// Keep these in sync with departmentNames / categories used elsewhere in
// the admin app so tickets land in filters and charts consistently.
const departments = ["Engineering", "Finance", "IT", "Product", "Support"];
const categories = ["Bug", "Billing", "IT Support", "Feature Request", "General"];

export default function TicketForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  });

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarSeverity, setSnackBarSeverity] = useState<"success" | "error">("success");
  const router = useRouter();

  const onSubmit = async (data: TicketFormData) => {
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setSnackBarSeverity("error");
        setSnackBarMessage(result.message || "Could not submit ticket");
        setOpenSnackBar(true);
        return;
      }

      setSnackBarSeverity("success");
      setSnackBarMessage("Ticket submitted!");
      setOpenSnackBar(true);
      reset();
      router.push(`/tickets/${result.ticket.id}`);
    } catch (error) {
      setSnackBarSeverity("error");
      setSnackBarMessage("Could not reach the server. Please try again.");
      setOpenSnackBar(true);
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 560, mx: "auto", p: 4, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Submit a ticket
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          {...register("title")}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          minRows={4}
          margin="normal"
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <Controller
          name="category"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select {...field} label="Category">
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
              <Typography color="error" variant="caption">
                {errors.category?.message}
              </Typography>
            </FormControl>
          )}
        />

        <Controller
          name="priority"
          control={control}
          defaultValue={"" as TicketFormData["priority"]}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.priority}>
              <InputLabel>Priority</InputLabel>
              <Select {...field} label="Priority">
                {priorities.map((p) => (
                  <MenuItem key={p.value} value={p.value}>
                    {p.label}
                  </MenuItem>
                ))}
              </Select>
              <Typography color="error" variant="caption">
                {errors.priority?.message}
              </Typography>
            </FormControl>
          )}
        />

        <Controller
          name="department"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.department}>
              <InputLabel>Department</InputLabel>
              <Select {...field} label="Department">
                {departments.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
              <Typography color="error" variant="caption">
                {errors.department?.message}
              </Typography>
            </FormControl>
          )}
        />

        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 3 }}>
          {isSubmitting ? "Submitting..." : "Submit ticket"}
        </Button>
      </Box>

      <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={() => setOpenSnackBar(false)}>
        <Alert severity={snackBarSeverity} variant="filled" onClose={() => setOpenSnackBar(false)}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
