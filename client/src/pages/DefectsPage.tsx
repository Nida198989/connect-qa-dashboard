import { Box, Card, LinearProgress, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FilterBar } from "../components/FilterBar";
import { KpiGrid } from "../components/DashboardWidgets";
import { KpiCard } from "../components/KpiCard";
import { useApp } from "../appState";

export function DefectsPage() {
  const { dashboard, filters, setFilters, refresh, users, modules, sprints, loading, clientView } = useApp();
  if (!dashboard) return <LinearProgress />;
  const d = dashboard.defects || { total: 0, newThisWeek: 0, open: 0, closedThisWeek: 0, reopened: 0, critical: 0, high: 0, medium: 0, low: 0, closed: 0 };
  return (
    <Stack spacing={2.5}>
      <Typography variant="h4">Defects</Typography>
      <Typography color="text.secondary">{filters.project ? `${filters.project} defects only.` : "Select Connect or Force to isolate defect metrics."}</Typography>
      <FilterBar filters={filters} onChange={setFilters} onRefresh={refresh} users={users} modules={modules} sprints={sprints} hideQa={clientView} />
      {loading && <LinearProgress />}
      <KpiGrid>
        <KpiCard color="slate" label="TOTAL DEFECTS" value={d.total} />
        <KpiCard color="blue" label="NEW THIS WEEK" value={d.newThisWeek} />
        <KpiCard color="orange" label="OPEN" value={d.open} />
        <KpiCard color="green" label="CLOSED THIS WEEK" value={d.closedThisWeek} />
        <KpiCard color="rose" label="REOPENED" value={d.reopened} />
        <KpiCard color="rose" label="CRITICAL" value={d.critical} />
        <KpiCard color="orange" label="HIGH" value={d.high} />
        <KpiCard color="teal" label="MEDIUM" value={d.medium} />
        <KpiCard color="slate" label="LOW" value={d.low} />
      </KpiGrid>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
        <Card sx={{ p: 2, height: 340 }}>
          <Typography variant="h6">Defects by Severity</Typography>
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie data={[{ name: "Critical", value: d.critical }, { name: "High", value: d.high }, { name: "Medium", value: d.medium }, { name: "Low", value: d.low }]} dataKey="value" nameKey="name">
                <Cell fill="#be123c" />
                <Cell fill="#ea580c" />
                <Cell fill="#0d9488" />
                <Cell fill="#64748b" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card sx={{ p: 2, height: 340 }}>
          <Typography variant="h6">Defects by Status</Typography>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={[{ name: "Open", value: d.open }, { name: "Closed", value: d.closed }, { name: "Reopened", value: d.reopened }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Box>
      <Card sx={{ p: 2, height: 340 }}>
        <Typography variant="h6">Defect Trend</Typography>
        <ResponsiveContainer width="100%" height={270}>
          <LineChart data={dashboard.sixWeekTrend || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="defectsRaised" name="Raised" stroke="#e11d48" />
            <Line dataKey="defectsClosed" name="Closed" stroke="#059669" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Defects by Module</Typography>
        <Box sx={{ height: 360 }}>
          <DataGrid
            rows={dashboard.modules}
            columns={[
              { field: "name", headerName: "Module", flex: 1, minWidth: 180 },
              { field: "raised", headerName: "Raised", width: 110, valueGetter: (_, r) => r.current?.defectsRaised ?? 0 },
              { field: "closed", headerName: "Closed", width: 110, valueGetter: (_, r) => r.current?.defectsClosed ?? 0 },
              { field: "open", headerName: "Open", width: 110, valueGetter: (_, r) => Math.max(0, (r.current?.defectsRaised || 0) - (r.current?.defectsClosed || 0)) },
            ]}
          />
        </Box>
      </Card>
    </Stack>
  );
}
