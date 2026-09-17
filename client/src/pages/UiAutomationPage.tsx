import { Card, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FilterBar } from "../components/FilterBar";
import { KpiCard } from "../components/KpiCard";
import { StatusBadge } from "../components/StatusBadge";
import { useApp } from "../appState";

export function UiAutomationPage() {
  const { dashboard, filters, setFilters, refresh, users, modules, sprints, loading } = useApp();
  if (!dashboard) return <LinearProgress />;

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4">UI Automation</Typography>
      <FilterBar filters={filters} onChange={setFilters} onRefresh={refresh} users={users} modules={modules} sprints={sprints} />
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}><KpiCard color="slate" label="UI TEST CASES" value={dashboard.kpis.totalTestCases} /></Grid>
        <Grid item xs={12} md={3}><KpiCard color="blue" label="UI AUTOMATED" value={dashboard.kpis.uiAutomated} /></Grid>
        <Grid item xs={12} md={3}><KpiCard color="orange" label="UI REMAINING" value={dashboard.kpis.remaining} /></Grid>
        <Grid item xs={12} md={3}><KpiCard color="green" label="UI COVERAGE" value={`${dashboard.kpis.automationCoverage}%`} /></Grid>
      </Grid>
      <Card sx={{ p: 2, height: 380 }}>
        <Typography variant="h6">UI Automation by Module</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dashboard.modules.map((m) => ({ name: m.name, ui: m.current?.uiAutomated || 0, total: m.current?.totalTestCases || 0 }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ui" name="UI Automated" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card sx={{ p: 2 }}>
        <Stack spacing={1.4}>
          {dashboard.modules.map((mod) => (
            <Stack key={mod.id} direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
              <Typography sx={{ width: 280, fontWeight: 700 }}>{mod.name}</Typography>
              <LinearProgress variant="determinate" value={mod.current?.coverage || 0} sx={{ flex: 1, height: 10, borderRadius: 99 }} />
              <Typography sx={{ width: 80 }}>{mod.current?.uiAutomated}/{mod.current?.totalTestCases}</Typography>
              <StatusBadge status={mod.current?.status} />
            </Stack>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
