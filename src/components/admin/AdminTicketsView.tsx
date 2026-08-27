// components/admin/AdminTicketsView.tsx
"use client";
import { useState, useMemo } from "react";
import { Box } from "@mui/material";
import TicketFilters, { TicketFilterValues } from "./TicketFilters";
import TicketTable from "./TicketTable";
import { Ticket } from "@/types/ticket";

export default function AdminTicketsView({
  tickets,
  departments,
}: {
  tickets: Ticket[];
  departments: string[];
}) {
  const [filters, setFilters] = useState<TicketFilterValues>({
    search: "",
    status: "all",
    priority: "all",
    department: "all",
  });

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.priority !== "all" && t.priority !== filters.priority) return false;
      if (filters.department !== "all" && t.department !== filters.department) return false;
      if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [tickets, filters]);

  return (
    <Box>
      <TicketFilters values={filters} onChange={setFilters} departments={departments} />
      <TicketTable tickets={filtered} />
    </Box>
  );
}