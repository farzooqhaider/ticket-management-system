"use client";
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,} from "@mui/material";
import { useRouter } from "next/navigation";
import { Ticket } from "@/types/ticket";
import StatusBadge from "@/components/admin/StatusBadge";
import PriorityBadge from "@/components/admin/PriorityBadge";

interface TicketTableProps {
  tickets: Ticket[];
  linkBase?: string; // "/admin/tickets" for staff, "/tickets" for customers
}

export default function TicketTable({ tickets, linkBase = "/admin/tickets" }: TicketTableProps) {
  const router = useRouter();

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Requester</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              hover
              onClick={() => router.push(`${linkBase}/${ticket.id}`)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>{ticket.title}</TableCell>
              <TableCell>
                <StatusBadge status={ticket.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={ticket.priority} />
              </TableCell>
              <TableCell>{ticket.department}</TableCell>
              <TableCell>{ticket.requesterName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
