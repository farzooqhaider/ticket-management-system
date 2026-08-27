import { Paper, Typography } from "@mui/material";

interface StatCardProps {
  label: string;
  value: string | number;
  valueColor?: string;
}

export default function StatCard({ label, value, valueColor }: StatCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, borderRadius: 2, flex: "1 1 160px", minWidth: 160 }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600, color: valueColor || "text.primary" }}>
        {value}
      </Typography>
    </Paper>
  );
}
