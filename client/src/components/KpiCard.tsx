import { Card, Typography } from "@mui/material";

const palettes: Record<string, { bg: string; accent: string; label: string }> = {
  blue: { bg: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", accent: "#dbeafe", label: "#bfdbfe" },
  purple: { bg: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", accent: "#ede9fe", label: "#ddd6fe" },
  teal: { bg: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", accent: "#ccfbf1", label: "#99f6e4" },
  green: { bg: "linear-gradient(135deg, #059669 0%, #047857 100%)", accent: "#d1fae5", label: "#a7f3d0" },
  orange: { bg: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)", accent: "#ffedd5", label: "#fed7aa" },
  slate: { bg: "linear-gradient(135deg, #334155 0%, #1e293b 100%)", accent: "#e2e8f0", label: "#cbd5e1" },
  rose: { bg: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)", accent: "#ffe4e6", label: "#fecdd3" },
};

export function KpiCard({
  label,
  value,
  hint,
  color = "blue",
}: {
  label: string;
  value: string | number;
  hint?: string;
  color?: keyof typeof palettes;
}) {
  const palette = palettes[color];
  return (
    <Card
      sx={{
        p: 2,
        color: "white",
        background: palette.bg,
        width: "100%",
        height: 132,
        minHeight: 132,
        maxHeight: 132,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: palette.label,
          fontWeight: 800,
          letterSpacing: 0.6,
          lineHeight: 1.25,
          minHeight: 32,
          maxHeight: 32,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: "white",
          lineHeight: 1,
          fontSize: { xs: "1.7rem", md: "1.85rem" },
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: palette.accent,
          minHeight: 18,
          maxHeight: 18,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          visibility: hint ? "visible" : "hidden",
        }}
      >
        {hint || "placeholder"}
      </Typography>
    </Card>
  );
}
