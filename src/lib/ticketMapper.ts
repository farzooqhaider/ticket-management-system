import type {
  Ticket as PrismaTicket,
  User,
  TicketStatus as PrismaStatus,
  TicketPriority as PrismaPriority,
} from "../../generated/prisma/client";
import type {
  Comment as PrismaComment,
  ActivityLog as PrismaActivityLog,
}from "../../generated/prisma/client";
import type {
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketComment,
  ActivityLogEntry,
} from "@/types/ticket";

type TicketWithRelations = PrismaTicket & {
  requester: User;
  assignee: User | null;
};

const statusMap: Record<PrismaStatus, TicketStatus> = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  WAITING_ON_CUSTOMER: "waiting_on_customer",
  RESOLVED: "resolved",
  CLOSED: "closed",
};

const priorityMap: Record<PrismaPriority, TicketPriority> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

// Your existing components (TicketTable, StatusBadge, TicketAnalytics, etc.)
// were built against the lowercase-string Ticket type in types/ticket.ts.
// Prisma's generated types use uppercase enums and relation objects instead
// of plain name strings, so every ticket read from the DB passes through
// here before it reaches those components.
export function toClientTicket(ticket: TicketWithRelations): Ticket {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: statusMap[ticket.status],
    priority: priorityMap[ticket.priority],
    category: ticket.category,
    department: ticket.department,
    requesterName: ticket.requester.userName,
    assigneeName: ticket.assignee?.userName ?? null,
    assigneeId: ticket.assigneeId,
    createdAt: ticket.createdAt.toISOString().slice(0, 10),
  };
}

export function toClientComment(comment: PrismaComment & { author: User }): TicketComment {
  return {
    id: comment.id,
    author: comment.author.userName,
    message: comment.message,
    createdAt: comment.createdAt.toISOString().slice(0, 16).replace("T", " "),
    isInternal: comment.isInternal,
  };
}

export function toClientActivity(entry: PrismaActivityLog): ActivityLogEntry {
  return {
    id: entry.id,
    action: entry.action,
    actor: entry.actor,
    timestamp: entry.timestamp.toISOString().slice(0, 16).replace("T", " "),
  };
}
