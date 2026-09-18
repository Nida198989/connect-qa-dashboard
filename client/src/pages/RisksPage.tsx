import { Alert, Button, Card, Grid, LinearProgress, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { deleteRisk, listRisks, saveRisk } from "../api/client";
import { FilterBar } from "../components/FilterBar";
import { useApp } from "../appState";
import { useAuth } from "../auth";
import type { Risk } from "../types";

const empty = { title: "", project: "Connect", impact: "", owner: "", status: "Open", expectedResolution: "" };

export function RisksPage() {
  const { user } = useAuth();
  const { dashboard, filters, setFilters, refresh, users, modules, sprints, loading, clientView } = useApp();
  const [rows, setRows] = useState<Risk[]>([]);
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const data = await listRisks();
    setRows(data);
  }

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  if (!dashboard) return <LinearProgress />;
  const visible = rows.filter((r) => !filters.project || r.project === filters.project);

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4">Risks & Blockers</Typography>
      <FilterBar filters={filters} onChange={setFilters} onRefresh={refresh} users={users} modules={modules} sprints={sprints} hideQa={clientView} />
      {loading && <LinearProgress />}
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      {!clientView && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add risk / blocker</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}><TextField fullWidth label="Risk / Blocker" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Grid>
            <Grid item xs={12} md={2}>
              <TextField select fullWidth label="Project" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}>
                <MenuItem value="Connect">Connect</MenuItem>
                <MenuItem value="Force">Force</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}><TextField fullWidth label="Impact" value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} /></Grid>
            <Grid item xs={12} md={2}><TextField fullWidth label="Owner" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} /></Grid>
            <Grid item xs={12} md={2}>
              <TextField select fullWidth label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Expected Resolution" value={form.expectedResolution} onChange={(e) => setForm({ ...form, expectedResolution: e.target.value })} /></Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                onClick={async () => {
                  setError("");
                  try {
                    if (!form.title.trim()) {
                      setError("Risk / Blocker is required.");
                      return;
                    }
                    await saveRisk(form);
                    setForm(empty);
                    setMessage("Risk saved.");
                    await load();
                    await refresh();
                  } catch (err: any) {
                    setError(err?.response?.data?.message || "Unable to save risk.");
                  }
                }}
              >
                Save Risk
              </Button>
            </Grid>
          </Grid>
        </Card>
      )}
      <Card sx={{ p: 2 }}>
        <div style={{ height: 420 }}>
          <DataGrid
            rows={visible}
            columns={[
              { field: "title", headerName: "Risk / Blocker", flex: 1.4, minWidth: 200, editable: !clientView },
              { field: "project", headerName: "Project", width: 120, editable: !clientView },
              { field: "impact", headerName: "Impact", width: 140, editable: !clientView },
              { field: "owner", headerName: "Owner", width: 140, editable: !clientView },
              { field: "status", headerName: "Status", width: 130, editable: !clientView },
              { field: "expectedResolution", headerName: "Expected Resolution", flex: 1, minWidth: 180, editable: !clientView },
              ...(!clientView && (user?.role === "lead" || user?.role === "admin")
                ? [{
                    field: "actions",
                    headerName: "",
                    width: 110,
                    renderCell: (params: any) => (
                      <Button color="error" size="small" onClick={async () => { await deleteRisk(params.row.id); await load(); await refresh(); }}>
                        Delete
                      </Button>
                    ),
                  }]
                : []),
            ]}
            processRowUpdate={async (next) => {
              await saveRisk(next as unknown as Record<string, unknown>, next.id);
              await load();
              return next;
            }}
          />
        </div>
        {!clientView && (
          <Typography variant="caption" color="text.secondary">Double-click a cell to edit. Connect and Force risks stay on their own project.</Typography>
        )}
      </Card>
    </Stack>
  );
}
