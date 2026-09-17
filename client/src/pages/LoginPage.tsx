import { Alert, Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../auth";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("nida.naaz@connect.qa");
  const [password, setPassword] = useState("Connect@123");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "radial-gradient(circle at top left, #7c3aed 0%, #2563eb 45%, #0f172a 100%)",
        p: 2,
      }}
    >
      <Card sx={{ width: "min(460px, 100%)", p: 4 }}>
        <Typography variant="h5">Connect QA Command Center</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Daily automation reporting for the Connect program.
        </Typography>
        <Stack
          component="form"
          spacing={2}
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              await login(email, password);
            } catch (err: unknown) {
              setError(err && typeof err === "object" && "response" in err ? "Invalid email or password." : "Unable to sign in.");
            } finally {
              setBusy(false);
            }
          }}
        >
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <Button type="submit" variant="contained" size="large" disabled={busy}>
            Sign in
          </Button>
          <Typography variant="body2" color="text.secondary">
            Demo: nida.naaz@connect.qa, priya.sharma@connect.qa, admin@connect.qa — password Connect@123
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
