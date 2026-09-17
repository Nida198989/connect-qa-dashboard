import { Box, Card, Grid, LinearProgress, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { FilterBar } from "../components/FilterBar";
import { KpiCard } from "../components/KpiCard";
import { StatusBadge } from "../components/StatusBadge";
import { useApp } from "../appState";

export function SprintProgressPage() {
  const { dashboard, filters, setFilters, refresh, users, modules, sprints, loading } = useApp();
  const [selected, setSelected] = useState(dashboard?.config.currentSprintId || "");
  if (!dashboard) return <LinearProgress />;
  const sprint = dashboard.sprints.find((s) => s.id === (selected || dashboard.config.currentSprintId)) || dashboard.sprints[0];

  const columns: GridColDef[] = [
    { field: "sprintName", headerName: "Sprint", flex: 1, minWidth: 140 },
    { field: "plannedTestCases", headerName: "Planned TC", width: 120 },
    { field: "manualWritten", headerName: "Manual Written", width: 140 },
    { field: "inSprintAutomated", headerName: "In-Sprint Automated", width: 170 },
    { field: "backlogAutomated", headerName: "Backlog Automated", width: 160 },
    { field: "remaining", headerName: "Remaining", width: 120 },
    { field: "completion", headerName: "Completion %", width: 130 },
    { field: "status", headerName: "Status", width: 140, renderCell: (p) => <StatusBadge status={p.row.status} /> },
  ];

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4">Sprint Progress</Typography>
      <FilterBar filters={filters} onChange={setFilters} onRefresh={refresh} users={users} modules={modules} sprints={sprints} />
      {loading && <LinearProgress />}
      <ToggleButtonGroup exclusive value={sprint?.id} onChange={(_, value) => value && setSelected(value)}>
        {dashboard.sprints.map((s) => (
          <ToggleButton key={s.id} value={s.id}>{s.sprintName}</ToggleButton>
        ))}
      </ToggleButtonGroup>
      {sprint && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2}><KpiCard color="slate" label="PLANNED" value={sprint.plannedTestCases} /></Grid>
          <Grid item xs={12} sm={6} md={2}><KpiCard color="green" label="COMPLETED" value={sprint.totalAutomated || 0} /></Grid>
          <Grid item xs={12} sm={6} md={2}><KpiCard color="orange" label="AUTOMATION %" value={`${sprint.completion || 0}%`} /></Grid>
          <Grid item xs={12} sm={6} md={2}><KpiCard color="purple" label="MANUAL DESIGN %" value={`${sprint.manualPct || 0}%`} /></Grid>
          <Grid item xs={12} sm={6} md={2}><KpiCard color="teal" label="EXECUTION %" value={`${sprint.executionPct || 0}%`} /></Grid>
          <Grid item xs={12} sm={6} md={2}><KpiCard color="rose" label="DEFECTS" value={`${sprint.defectsRaised || 0} / ${sprint.defectsClosed || 0}`} hint="Raised / Closed" /></Grid>
        </Grid>
      )}
      <Card sx={{ p: 2 }}>
        <Box sx={{ height: 420 }}>
          <DataGrid rows={dashboard.sprints} columns={columns} onRowClick={(p) => setSelected(p.row.id)} />
        </Box>
      </Card>
    </Stack>
  );
}
