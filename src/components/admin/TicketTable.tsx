"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Ticket } from "@/types/ticket";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

export default function TicketTable({ tickets }: { tickets: Ticket[] }) {
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
              onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
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
