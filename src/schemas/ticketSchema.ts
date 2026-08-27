import { z } from "zod";

export const ticketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(150, "Title must be under 150 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  priority: z.enum(["low", "medium", "high", "urgent"], {message: "Please select a priority",}),
  department: z.string().min(1, "Please select a department"),
});

export type TicketFormData = z.infer<typeof ticketSchema>;
