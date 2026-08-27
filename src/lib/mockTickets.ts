import { Ticket } from "@/types/ticket";


export const mockTickets: Ticket[] = [
  { id: "1", title: "Login page shows 500 error", description: "", status: "open", priority: "urgent", category: "Bug", department: "Engineering", requesterName: "Sara Ahmed", assigneeName: null, createdAt: "2026-08-10" },
  { id: "2", title: "Invoice not received for July", description: "", status: "in_progress", priority: "medium", category: "Billing", department: "Finance", requesterName: "Bilal Khan", assigneeName: "Ayesha Noor", createdAt: "2026-08-11" },
  { id: "3", title: "Laptop won't connect to office WiFi", description: "", status: "waiting_on_customer", priority: "low", category: "IT Support", department: "IT", requesterName: "Hamza Tariq", assigneeName: "Usman Ali", createdAt: "2026-08-12" },
  { id: "4", title: "Add dark mode to dashboard", description: "", status: "open", priority: "low", category: "Feature Request", department: "Product", requesterName: "Fatima Zahra", assigneeName: null, createdAt: "2026-08-09" },
  { id: "5", title: "Password reset email not arriving", description: "", status: "open", priority: "high", category: "Bug", department: "Engineering", requesterName: "Ali Raza", assigneeName: "Usman Ali", createdAt: "2026-08-08" },
  { id: "6", title: "Refund request for cancelled plan", description: "", status: "resolved", priority: "medium", category: "Billing", department: "Finance", requesterName: "Zara Sheikh", assigneeName: "Ayesha Noor", createdAt: "2026-08-05" },
  { id: "7", title: "Printer offline on 3rd floor", description: "", status: "closed", priority: "low", category: "IT Support", department: "IT", requesterName: "Omar Farooq", assigneeName: "Usman Ali", createdAt: "2026-08-01" },
  { id: "8", title: "API rate limit too low for our plan", description: "", status: "in_progress", priority: "high", category: "Bug", department: "Engineering", requesterName: "Nida Hussain", assigneeName: "Sara Ahmed", createdAt: "2026-08-07" },
  { id: "9", title: "Requesting export of account data", description: "", status: "waiting_on_customer", priority: "medium", category: "General", department: "Support", requesterName: "Kamran Iqbal", assigneeName: "Ayesha Noor", createdAt: "2026-08-06" },
  { id: "10", title: "Mobile app crashes on checkout", description: "", status: "open", priority: "urgent", category: "Bug", department: "Engineering", requesterName: "Mahnoor Sheikh", assigneeName: null, createdAt: "2026-08-12" },
  { id: "11", title: "Duplicate charge on card ending 4021", description: "", status: "resolved", priority: "high", category: "Billing", department: "Finance", requesterName: "Yusuf Ahmed", assigneeName: "Ayesha Noor", createdAt: "2026-08-03" },
  { id: "12", title: "New hire needs system access", description: "", status: "closed", priority: "medium", category: "IT Support", department: "IT", requesterName: "Ayesha Malik", assigneeName: "Usman Ali", createdAt: "2026-07-30" },
];

export const departmentNames = Array.from(new Set(mockTickets.map((t) => t.department)));
