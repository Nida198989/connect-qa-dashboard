import { Box, Card, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import dayjs from "dayjs";
import { FilterBar } from "../components/FilterBar";
import { KpiCard } from "../components/KpiCard";
import { StatusBadge } from "../components/StatusBadge";
import { useApp } from "../appState";

export function DashboardPage() {
  const { dashboard, filters, setFilters, refresh, users, modules, sprints, loading, clientView } = useApp();
  if (!dashboard) return <LinearProgress />;

  const compare = [
    { name: "Today", inSprint: dashboard.inSprintVsBacklog.inSprint.today, backlog: dashboard.inSprintVsBacklog.backlog.today },
    { name: "This Week", inSprint: dashboard.inSprintVsBacklog.inSprint.week, backlog: dashboard.inSprintVsBacklog.backlog.week },
    { name: "Current Sprint", inSprint: dashboard.inSprintVsBacklog.inSprint.sprint, backlog: dashboard.inSprintVsBacklog.backlog.sprint },
    { name: "Cumulative", inSprint: dashboard.inSprintVsBacklog.inSprint.cumulative, backlog: dashboard.inSprintVsBacklog.backlog.cumulative },
  ];

  const donut = [
    { name: "UI Automated", value: dashboard.kpis.uiAutomated, color: "#2563eb" },
    { name: "Remaining", value: dashboard.kpis.remaining, color: "#cbd5e1" },
  ];

  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", width: 120, valueGetter: (_, row) => dayjs(row.date).format("DD-MMM") },
    { field: "qaName", headerName: "QA", flex: 1, minWidth: 140 },
    { field: "inSprintAutomated", headerName: "In-Sprint", width: 110 },
    { field: "backlogAutomated", headerName: "Backlog", width: 110 },
    { field: "uiAutomated", headerName: "UI", width: 80 },
    { field: "apiAutomated", headerName: "API", width: 80 },
    { field: "totalAutomated", headerName: "Total", width: 90 },
  ];

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Executive Dashboard</Typography>
          <Typography color="text.secondary">
            {dashboard.range.label}: {dayjs(dashboard.range.start).format("DD MMM YYYY")} → {dayjs(dashboard.range.end).format("DD MMM YYYY")}
          </Typography>
        </Box>
      </Stack>
      <FilterBar filters={filters} onChange={setFilters} onRefresh={refresh} users={users} modules={modules} sprints={sprints} hideQa={clientView} />
      {loading && <LinearProgress />}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2.4}><KpiCard color="slate" label="TOTAL TC" value={dashboard.kpis.totalTestCases} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><KpiCard color="purple" label="MANUAL TEST CASES" value={dashboard.kpis.manualWritten} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><KpiCard color="blue" label="UI AUTOMATED" value={dashboard.kpis.uiAutomated} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><KpiCard color="teal" label="API AUTOMATED" value={dashboard.kpis.apiAutomated} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><KpiCard color="green" label="TOTAL AUTOMATED" value={dashboard.kpis.totalAutomated} hint={dashboard.kpis.countingMode === "unique_test_cases" ? "Unique TCs, no UI+API double count" : "Configured counting model"} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><KpiCard color="orange" label="AUTOMATION COVERAGE" value={`${dashboard.kpis.automationCoverage}%`} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><KpiCard color="teal" label="APIS RECORDED" value={dashboard.kpis.apiRecorded} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><KpiCard color="purple" label="API COVERAGE" value={`${dashboard.kpis.apiCoverage}%`} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><KpiCard color="blue" label="IN-SPRINT AUTOMATED" value={dashboard.kpis.inSprintAutomated} /></Grid>
        <Grid item xs={12} sm={6} md={2.4}><KpiCard color="orange" label="BACKLOG AUTOMATED" value={dashboard.kpis.backlogAutomated} /></Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, height: 360 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Test Cases Automated Per Day</Typography>
            <ResponsiveContainer width="100%" height={290}>
              <LineChart data={dashboard.chartByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(v) => dayjs(v).format("DD MMM")} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalAutomated" name="Daily Total" stroke="#2563eb" strokeWidth={3} />
                <Line type="monotone" dataKey="inSprintAutomated" name="In-Sprint" stroke="#7c3aed" />
                <Line type="monotone" dataKey="backlogAutomated" name="Backlog" stroke="#ea580c" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: 360 }}>
            <Typography variant="h6">Coverage Mix</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={donut} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                  {donut.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 2, height: 380 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>In-Sprint vs Backlog Automation</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={compare}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inSprint" name="In-Sprint" stackId="a" fill="#2563eb" />
                <Bar dataKey="backlog" name="Backlog" stackId="a" fill="#ea580c" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Grid container spacing={1.5}>
            <Grid item xs={6}><KpiCard color="blue" label="IN-SPRINT TODAY" value={dashboard.inSprintVsBacklog.inSprint.today} /></Grid>
            <Grid item xs={6}><KpiCard color="orange" label="BACKLOG TODAY" value={dashboard.inSprintVsBacklog.backlog.today} /></Grid>
            <Grid item xs={6}><KpiCard color="purple" label="IN-SPRINT WEEK" value={dashboard.inSprintVsBacklog.inSprint.week} /></Grid>
            <Grid item xs={6}><KpiCard color="teal" label="BACKLOG WEEK" value={dashboard.inSprintVsBacklog.backlog.week} /></Grid>
            <Grid item xs={6}><KpiCard color="green" label="IN-SPRINT SPRINT" value={dashboard.inSprintVsBacklog.inSprint.sprint} /></Grid>
            <Grid item xs={6}><KpiCard color="slate" label="BACKLOG SPRINT" value={dashboard.inSprintVsBacklog.backlog.sprint} /></Grid>
          </Grid>
        </Grid>
      </Grid>

      <Card sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Daily Productivity</Typography>
        <Box sx={{ height: 360 }}>
          <DataGrid
            rows={dashboard.dailyTrend.map((r, i) => ({ id: `${r.date}-${r.userId}-${i}`, ...r }))}
            columns={clientView ? columns.filter((c) => c.field !== "qaName") : columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          />
        </Box>
      </Card>

      <Card sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Module Snapshot</Typography>
        <Stack spacing={1.2}>
          {dashboard.modules.slice(0, 8).map((mod) => (
            <Stack key={mod.id} direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
              <Typography sx={{ width: 260, fontWeight: 700 }}>{mod.name}</Typography>
              <Box sx={{ flex: 1 }}>
                <LinearProgress variant="determinate" value={mod.current?.coverage || 0} sx={{ height: 10, borderRadius: 99 }} />
              </Box>
              <Typography sx={{ width: 70 }}>{mod.current?.coverage}%</Typography>
              <StatusBadge status={mod.current?.status} />
            </Stack>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
