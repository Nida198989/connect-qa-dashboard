import { Box, Card, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FilterBar } from "../components/FilterBar";
import { KpiCard } from "../components/KpiCard";
import { useApp } from "../appState";

export function ApiAutomationPage() {
  const { dashboard, filters, setFilters, refresh, users, modules, sprints, loading } = useApp();
  if (!dashboard) return <LinearProgress />;

  const rows = dashboard.modules.map((m) => ({
    id: m.id,
    name: m.name,
    recorded: m.current?.apiRecorded || 0,
    automated: m.current?.apiAutomated || 0,
    remaining: Math.max(0, (m.current?.apiRecorded || 0) - (m.current?.apiAutomated || 0)),
    coverage: m.current?.apiRecorded ? Math.round(((m.current.apiAutomated || 0) / m.current.apiRecorded) * 1000) / 10 : 0,
  }));

  const columns: GridColDef[] = [
    { field: "name", headerName: "Module", flex: 1, minWidth: 200 },
    { field: "recorded", headerName: "APIs Recorded", width: 140 },
    { field: "automated", headerName: "APIs Automated", width: 150 },
    { field: "remaining", headerName: "Remaining", width: 120 },
    { field: "coverage", headerName: "Coverage %", width: 130 },
  ];

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4">API Automation</Typography>
      <FilterBar filters={filters} onChange={setFilters} onRefresh={refresh} users={users} modules={modules} sprints={sprints} />
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        <Grid item xs={12} md={2.4}><KpiCard color="teal" label="APIS RECORDED" value={dashboard.kpis.apiRecorded} /></Grid>
        <Grid item xs={12} md={2.4}><KpiCard color="blue" label="APIS AUTOMATED" value={dashboard.kpis.apiAutomated} /></Grid>
        <Grid item xs={12} md={2.4}><KpiCard color="green" label="API COVERAGE" value={`${dashboard.kpis.apiCoverage}%`} /></Grid>
        <Grid item xs={12} md={2.4}><KpiCard color="purple" label="ADDED THIS WEEK" value={dashboard.period.apiAutomated} /></Grid>
        <Grid item xs={12} md={2.4}><KpiCard color="orange" label="RECORDED THIS PERIOD" value={dashboard.period.apisRecorded} /></Grid>
      </Grid>
      <Card sx={{ p: 2, height: 380 }}>
        <Typography variant="h6">APIs Recorded vs Automated</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rows.filter((r) => r.recorded || r.automated)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="recorded" name="Recorded" fill="#7c3aed" />
            <Bar dataKey="automated" name="Automated" fill="#0d9488" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card sx={{ p: 2 }}>
        <Box sx={{ height: 520 }}>
          <DataGrid rows={rows} columns={columns} />
        </Box>
      </Card>
    </Stack>
  );
}
