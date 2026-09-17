import { Box, Card, Typography } from "@mui/material";

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
    <Card sx={{ p: 2.2, color: "white", background: palette.bg, minHeight: 118 }}>
      <Typography variant="caption" sx={{ color: palette.label, fontWeight: 800, letterSpacing: 0.8 }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ mt: 0.6, color: "white" }}>
        {value}
      </Typography>
      {hint && (
        <Box sx={{ mt: 0.6 }}>
          <Typography variant="caption" sx={{ color: palette.accent }}>
            {hint}
          </Typography>
        </Box>
      )}
    </Card>
  );
}
