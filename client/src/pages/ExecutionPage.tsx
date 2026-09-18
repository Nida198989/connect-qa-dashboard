import { Card, LinearProgress, Stack, Typography } from "@mui/material";
import { Cell, Legend, Line, LineChart, Pie, PieChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FilterBar } from "../components/FilterBar";
import { KpiGrid } from "../components/DashboardWidgets";
import { KpiCard } from "../components/KpiCard";
import { useApp } from "../appState";
import { pctOrNA } from "../projects";

export function ExecutionPage() {
  const { dashboard, filters, setFilters, refresh, users, modules, sprints, loading, clientView } = useApp();
  if (!dashboard) return <LinearProgress />;
  const e = dashboard.execution || { executed: 0, passed: 0, failed: 0, blocked: 0, notExecuted: 0, passPct: 0, flaky: 0 };
  return (
    <Stack spacing={2.5}>
      <Typography variant="h4">Test Execution</Typography>
      <Typography color="text.secondary">Pass % = Passed / Total Executed × 100. {filters.project ? `${filters.project} only.` : "Select a project to isolate metrics."}</Typography>
      <FilterBar filters={filters} onChange={setFilters} onRefresh={refresh} users={users} modules={modules} sprints={sprints} hideQa={clientView} />
      {loading && <LinearProgress />}
      <KpiGrid>
        <KpiCard color="blue" label="TOTAL EXECUTED" value={e.executed} />
        <KpiCard color="green" label="PASSED" value={e.passed} />
        <KpiCard color="rose" label="FAILED" value={e.failed} />
        <KpiCard color="orange" label="BLOCKED" value={e.blocked} />
        <KpiCard color="slate" label="NOT EXECUTED" value={e.notExecuted} />
        <KpiCard color="green" label="PASS %" value={pctOrNA(e.passed, e.executed)} />
      </KpiGrid>
      <Card sx={{ p: 2, height: 360 }}>
        <Typography variant="h6">Execution Status</Typography>
        <ResponsiveContainer width="100%" height={290}>
          <PieChart>
            <Pie
              data={[
                { name: "Passed", value: e.passed },
                { name: "Failed", value: e.failed },
                { name: "Blocked", value: e.blocked },
                { name: "Not Executed", value: e.notExecuted },
              ]}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={95}
            >
              <Cell fill="#059669" />
              <Cell fill="#e11d48" />
              <Cell fill="#ea580c" />
              <Cell fill="#94a3b8" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
      <Card sx={{ p: 2, height: 360 }}>
        <Typography variant="h6">Weekly Execution Trend</Typography>
        <ResponsiveContainer width="100%" height={290}>
          <LineChart data={dashboard.sixWeekTrend || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="testCasesExecuted" name="Executed" stroke="#2563eb" strokeWidth={3} />
            <Line dataKey="passed" name="Passed" stroke="#059669" />
            <Line dataKey="failed" name="Failed" stroke="#e11d48" />
            <Line dataKey="blocked" name="Blocked" stroke="#ea580c" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card sx={{ p: 2, height: 340 }}>
        <Typography variant="h6">Pass % Trend</Typography>
        <ResponsiveContainer width="100%" height={270}>
          <LineChart
            data={(dashboard.sixWeekTrend || []).map((row: any) => ({
              ...row,
              passPct: row.testCasesExecuted ? Math.round((row.passed / row.testCasesExecuted) * 1000) / 10 : 0,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line dataKey="passPct" name="Pass %" stroke="#059669" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Stack>
  );
}
