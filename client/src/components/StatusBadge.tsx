import { Chip } from "@mui/material";
import type { StatusTone } from "../types";

const map = {
  green: { label: "🟢", color: "success" as const },
  amber: { label: "🟡", color: "warning" as const },
  orange: { label: "🟠", color: "warning" as const },
  red: { label: "🔴", color: "error" as const },
};

export function StatusBadge({ status }: { status?: StatusTone }) {
  if (!status) return null;
  const tone = map[status.tone];
  return <Chip size="small" color={tone.color} label={`${tone.label} ${status.label} `} sx={{ fontWeight: 700 }} />;
}
