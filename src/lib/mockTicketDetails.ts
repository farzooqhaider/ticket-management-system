import { TicketComment, ActivityLogEntry } from "@/types/ticket";


export const mockComments: Record<string, TicketComment[]> = {
  "1": [
    {
      id: "c1",
      author: "Sara Ahmed",
      message: "I get a 500 error every time I try to log in since this morning.",
      createdAt: "2026-08-10 09:14",
      isInternal: false,
    },
    {
      id: "c2",
      author: "Usman Ali",
      message: "Checked the logs — looks like a database connection timeout. Investigating.",
      createdAt: "2026-08-10 10:02",
      isInternal: true,
    },
  ],
};


export const mockActivityLogs: Record<string, ActivityLogEntry[]> = {
  "1": [
    { id: "a1", action: "Ticket created", actor: "Sara Ahmed", timestamp: "2026-08-10 09:14" },
    { id: "a2", action: "Assigned to Engineering", actor: "Admin", timestamp: "2026-08-10 09:20" },
    { id: "a3", action: "Assigned to Usman Ali", actor: "Admin", timestamp: "2026-08-10 09:21" },
  ],
};
export interface Agent {
  id: string;
  name: string;
}

export const agentsByDepartment: Record<string, Agent[]> = {
  Engineering:  [
    { id: "user_usman", name: "Usman Ali" },
    { id: "user_sara", name: "Sara Ahmed" }
  ],
  Finance: [
    { id: "user_ali", name: "Ali" },
    { id: "user_zara", name: "Zara" }
  ],
  IT:[{ id: "user_ahmed", name: "Ahmed" },
    { id: "user_lara", name: "Lara" }],
  Product: [{ id: "user_ahmer", name: "Ahmer" },
    { id: "user_fatima", name: "Fatima" }],
  Support: [{ id: "user_farooq", name: "Farooq" },
    { id: "user_noor", name: "noor" }],
};
