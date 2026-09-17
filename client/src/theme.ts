import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2563eb" },
    secondary: { main: "#7c3aed" },
    success: { main: "#059669" },
    warning: { main: "#ea580c" },
    error: { main: "#dc2626" },
    info: { main: "#0d9488" },
    background: { default: "#f3f6fb", paper: "#ffffff" },
    text: { primary: "#0f172a", secondary: "#475569" },
  },
  typography: {
    fontFamily: "Manrope, Segoe UI, sans-serif",
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)" },
      },
    },
  },
});
