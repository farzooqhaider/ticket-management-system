import { z } from "zod";

export const staffAssignSchema = z.object({
  role: z.enum(["ADMIN", "CUSTOMER"]),
  department: z.string().nullable(),
}).refine(
  (data) => data.role === "CUSTOMER" || (data.department && data.department.length > 0),
  { path: ["department"], message: "Department is required for staff accounts" }
);

export type StaffAssignFormData = z.infer<typeof staffAssignSchema>;