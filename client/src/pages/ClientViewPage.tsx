import { LinearProgress, Stack, Typography } from "@mui/material";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect } from "react";
import { FilterBar } from "../components/FilterBar";
import { HighlightsPanel, ProjectHealthCards } from "../components/DashboardWidgets";
import { StatusBadge } from "../components/StatusBadge";
import { useApp } from "../appState";
import { Card } from "@mui/material";

export function ClientViewPage() {
  const { dashboard, filters, setFilters, refresh, users, modules, sprints, loading, setClientView } = useApp();
  useEffect(() => {
    setClientView(true);
  }, [setClientView]);
  if (!dashboard) return <LinearProgress />;

  return (
    <Stack spacing={2.5} className="print-area">
      <Typography variant="h4">Client Executive View</Typography>
      <Typography color="text.secondary">
        High-level QA delivery status. Individual productivity, daily entry, and internal comments are hidden.
        {filters.project ? ` ${filters.project} only.` : " Use the project selector — combined numbers are labelled Combined on the executive landing page."}
      </Typography>
      <FilterBar filters={filters} onChange={setFilters} onRefresh={refresh} users={users} modules={modules} sprints={sprints} hideQa />
      {loading && <LinearProgress />}
      <ProjectHealthCards dash={dashboard} combined={!filters.project} />
      <HighlightsPanel dash={dashboard} project={filters.project} />
      <Card sx={{ p: 2, height: 340 }}>
        <Typography variant="h6">Automation trend</Typography>
        <ResponsiveContainer width="100%" height={270}>
          <LineChart data={dashboard.chartByDate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="totalAutomated" name="Automated" stroke="#2563eb" strokeWidth={3} />
            <Line dataKey="inSprintAutomated" name="Sprint" stroke="#7c3aed" />
            <Line dataKey="backlogAutomated" name="Backlog" stroke="#ea580c" />
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
