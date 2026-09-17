import { Card, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect } from "react";
import { FilterBar } from "../components/FilterBar";
import { KpiCard } from "../components/KpiCard";
import { StatusBadge } from "../components/StatusBadge";
import { useApp } from "../appState";

export function ClientViewPage() {
  const { dashboard, filters, setFilters, refresh, users, modules, sprints, loading, setClientView } = useApp();
  useEffect(() => {
    setClientView(true);
  }, [setClientView]);
  if (!dashboard) return <LinearProgress />;

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4">Client Executive View</Typography>
      <Typography color="text.secondary">
        Program-level quality and automation status for Connect. Individual QA productivity and internal comments are hidden.
      </Typography>
      <FilterBar filters={filters} onChange={setFilters} onRefresh={refresh} users={users} modules={modules} sprints={sprints} hideQa />
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}><KpiCard color="slate" label="TOTAL TEST CASES" value={dashboard.kpis.totalTestCases} /></Grid>
        <Grid item xs={12} md={3}><KpiCard color="green" label="AUTOMATION COVERAGE" value={`${dashboard.kpis.automationCoverage}%`} /></Grid>
        <Grid item xs={12} md={3}><KpiCard color="blue" label="UI AUTOMATED" value={dashboard.kpis.uiAutomated} /></Grid>
        <Grid item xs={12} md={3}><KpiCard color="teal" label="API AUTOMATED" value={dashboard.kpis.apiAutomated} /></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, minHeight: 180, background: "linear-gradient(135deg,#ecfeff,#ffffff)" }}>
            <Typography variant="h6">Key achievements</Typography>
            <Typography sx={{ mt: 1 }}>{dashboard.config.clientAchievements}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, minHeight: 180, background: "linear-gradient(135deg,#f5f3ff,#ffffff)" }}>
            <Typography variant="h6">Current focus</Typography>
            <Typography sx={{ mt: 1 }}>{dashboard.config.clientFocus}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, minHeight: 180, background: "linear-gradient(135deg,#fff7ed,#ffffff)" }}>
            <Typography variant="h6">Risks / dependencies</Typography>
            <Typography sx={{ mt: 1 }}>{dashboard.config.clientRisks}</Typography>
          </Card>
        </Grid>
      </Grid>
      <Card sx={{ p: 2, height: 340 }}>
        <Typography variant="h6">Weekly trend</Typography>
        <ResponsiveContainer width="100%" height={270}>
          <LineChart data={dashboard.chartByDate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="totalAutomated" name="Automated" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card sx={{ p: 2, height: 360 }}>
        <Typography variant="h6">Sprint progress</Typography>
        <ResponsiveContainer width="100%" height={290}>
          <BarChart data={dashboard.sprints}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sprintName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalAutomated" name="Completed" fill="#059669" />
            <Bar dataKey="plannedTestCases" name="Planned" fill="#94a3b8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>Module-wise progress</Typography>
        <Stack spacing={1.3}>
          {dashboard.modules.map((mod) => (
            <Stack key={mod.id} direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
              <Typography sx={{ width: 280, fontWeight: 700 }}>{mod.name}</Typography>
              <LinearProgress variant="determinate" value={mod.current?.coverage || 0} sx={{ flex: 1, height: 10, borderRadius: 99 }} />
              <Typography sx={{ width: 70 }}>{mod.current?.coverage}%</Typography>
              <StatusBadge status={mod.current?.status} />
            </Stack>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
