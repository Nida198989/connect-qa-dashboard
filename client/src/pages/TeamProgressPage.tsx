import { Alert, Box, Card, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FilterBar } from "../components/FilterBar";
import { KpiCard } from "../components/KpiCard";
import { useApp } from "../appState";

export function TeamProgressPage() {
  const { dashboard, filters, setFilters, refresh, users, modules, sprints, loading, clientView } = useApp();
  if (!dashboard) return <LinearProgress />;
  if (clientView) return <Alert severity="info">Team productivity is hidden in Client View.</Alert>;

  const columns: GridColDef[] = [
    { field: "name", headerName: "QA Member", flex: 1, minWidth: 160 },
    { field: "manualWritten", headerName: "Manual TC", width: 120 },
    { field: "inSprintAutomated", headerName: "Sprint Automation", width: 160 },
    { field: "backlogAutomated", headerName: "Backlog Automation", width: 170 },
    { field: "apiAutomated", headerName: "API Automation", width: 150 },
    { field: "testCasesExecuted", headerName: "Execution", width: 120 },
    { field: "totalAutomated", headerName: "Total Automated", width: 150 },
    { field: "dailyAverage", headerName: "Daily Average", width: 140 },
    { field: "daysLogged", headerName: "Days Logged", width: 130 },
  ];

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4">QA Team Productivity — Internal</Typography>
      <Typography color="text.secondary">Internal QA Lead view only. This is hidden from Client View and is not shown as the primary dashboard.</Typography>
      <FilterBar filters={filters} onChange={setFilters} onRefresh={refresh} users={users} modules={modules} sprints={sprints} />
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        {dashboard.team.map((member) => (
          <Grid item xs={12} md={3} key={member.userId}>
            <KpiCard color="blue" label={member.name.toUpperCase()} value={member.totalAutomated} hint={`Daily avg ${member.dailyAverage} · In-sprint ${member.inSprintAutomated} · Backlog ${member.backlogAutomated}`} />
          </Grid>
        ))}
      </Grid>
      <Card sx={{ p: 2, height: 360 }}>
        <Typography variant="h6">Automation Completed by QA</Typography>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dashboard.team}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="inSprintAutomated" name="In-Sprint" fill="#2563eb" />
            <Bar dataKey="backlogAutomated" name="Backlog" fill="#ea580c" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card sx={{ p: 2 }}>
        <Box sx={{ height: 420 }}>
          <DataGrid rows={dashboard.team.map((t) => ({ id: t.userId, ...t }))} columns={columns} />
        </Box>
      </Card>
    </Stack>
  );
}
