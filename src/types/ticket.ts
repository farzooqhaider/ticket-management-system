export type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_on_customer"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string | null;
  department: string;
  requesterName: string;
  assigneeName: string | null;
  assigneeId: string | null;
  createdAt: string;
}

export interface TicketComment {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  isInternal: boolean; // internal notes are only visible to staff, not the requester
}

export interface ActivityLogEntry {
  id: string;
  action: string; // e.g. "Status changed to In progress"
  actor: string; // who performed the action
  timestamp: string;
}
