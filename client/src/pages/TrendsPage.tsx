import { Card, LinearProgress, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FilterBar } from "../components/FilterBar";
import { KpiGrid } from "../components/DashboardWidgets";
import { KpiCard } from "../components/KpiCard";
import { useApp } from "../appState";
import { signed } from "../projects";

export function TrendsPage() {
  const { dashboard, filters, setFilters, refresh, users, modules, sprints, loading, clientView } = useApp();
  if (!dashboard) return <LinearProgress />;
  const weekly = dashboard.weekComparison;
  return (
    <Stack spacing={2.5}>
      <Typography variant="h4">Weekly Trends</Typography>
      <Typography color="text.secondary">
        Last 6 ISO weeks. Switch Project to Connect or Force — the chart never mixes the two.
      </Typography>
      <FilterBar filters={filters} onChange={setFilters} onRefresh={refresh} users={users} modules={modules} sprints={sprints} hideQa={clientView} />
      <TextField
        select
        label="Trend project"
        size="small"
        value={filters.project || ""}
        onChange={(e) => setFilters({ ...filters, project: e.target.value, moduleId: "", sprintId: "" })}
        sx={{ maxWidth: 280 }}
      >
        <MenuItem value="">All Projects (labelled combined)</MenuItem>
        <MenuItem value="Connect">Connect</MenuItem>
        <MenuItem value="Force">Force</MenuItem>
      </TextField>
      {loading && <LinearProgress />}
      <KpiGrid>
        <KpiCard color="green" label="WEEKLY AUTOMATION Δ" value={signed(weekly?.totalAutomated.change)} hint={`Prev ${weekly?.totalAutomated.previous ?? 0}`} />
        <KpiCard color="blue" label="WEEKLY SPRINT AUTO Δ" value={signed(weekly?.inSprintAutomated.change)} />
        <KpiCard color="orange" label="WEEKLY BACKLOG AUTO Δ" value={signed(weekly?.backlogAutomated.change)} />
        <KpiCard color="teal" label="WEEKLY API AUTO Δ" value={signed(weekly?.apiAutomated.change)} />
        <KpiCard color="purple" label="WEEKLY MANUAL TC Δ" value={signed(weekly?.manualWritten.change)} />
        <KpiCard color="rose" label="WEEKLY DEFECTS Δ" value={signed(weekly?.defectsRaised.change)} />
      </KpiGrid>
      <Card sx={{ p: 2, height: 420 }}>
        <Typography variant="h6">6-Week Trend — {filters.project || "Combined"}</Typography>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={dashboard.sixWeekTrend || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="totalAutomated" name="Total Automated" stroke="#2563eb" strokeWidth={3} />
            <Line dataKey="inSprintAutomated" name="Sprint Automation" stroke="#7c3aed" />
            <Line dataKey="backlogAutomated" name="Backlog Automation" stroke="#ea580c" />
            <Line dataKey="apiAutomated" name="API Automation" stroke="#0d9488" />
            <Line dataKey="manualWritten" name="Manual TC Written" stroke="#334155" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Stack>
  );
}
