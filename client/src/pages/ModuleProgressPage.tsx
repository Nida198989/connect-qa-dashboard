import { Box, Card, Dialog, DialogContent, DialogTitle, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getModuleDetail } from "../api/client";
import { FilterBar } from "../components/FilterBar";
import { KpiCard } from "../components/KpiCard";
import { StatusBadge } from "../components/StatusBadge";
import { useApp } from "../appState";

export function ModuleProgressPage() {
  const { dashboard, filters, setFilters, refresh, users, modules, sprints, loading } = useApp();
  const [detail, setDetail] = useState<any>(null);

  if (!dashboard) return <LinearProgress />;

  const columns: GridColDef[] = [
    { field: "name", headerName: "Module", flex: 1.4, minWidth: 200 },
    { field: "total", headerName: "Total TC", width: 100, valueGetter: (_, r) => r.current.totalTestCases },
    { field: "manual", headerName: "Manual", width: 100, valueGetter: (_, r) => r.current.manualWritten },
    { field: "ui", headerName: "UI Automated", width: 130, valueGetter: (_, r) => r.current.uiAutomated },
    { field: "api", headerName: "API Automated", width: 130, valueGetter: (_, r) => r.current.apiAutomated },
    { field: "auto", headerName: "Total Automated", width: 150, valueGetter: (_, r) => r.current.totalAutomated },
    { field: "remaining", headerName: "Remaining", width: 110, valueGetter: (_, r) => r.current.remaining },
    {
      field: "coverage",
      headerName: "Coverage",
      width: 180,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
          <LinearProgress variant="determinate" value={params.row.current.coverage} sx={{ flex: 1, height: 8, borderRadius: 99 }} />
          <Typography variant="body2">{params.row.current.coverage}%</Typography>
        </Stack>
      ),
    },
    { field: "status", headerName: "Status", width: 140, renderCell: (p) => <StatusBadge status={p.row.current.status} /> },
  ];

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4">Module Progress</Typography>
      <FilterBar filters={filters} onChange={setFilters} onRefresh={refresh} users={users} modules={modules} sprints={sprints} />
      {loading && <LinearProgress />}
      <Card sx={{ p: 2 }}>
        <Box sx={{ height: 640 }}>
          <DataGrid
            rows={dashboard.modules}
            columns={columns}
            onRowClick={async (params) => setDetail(await getModuleDetail(params.row.id))}
            pageSizeOptions={[10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          />
        </Box>
      </Card>

      <Dialog open={Boolean(detail)} onClose={() => setDetail(null)} maxWidth="lg" fullWidth>
        <DialogTitle>{detail?.module?.name}</DialogTitle>
        <DialogContent>
          {detail && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}><KpiCard color="slate" label="TOTAL TC" value={detail.module.current.totalTestCases} /></Grid>
                <Grid item xs={6} md={3}><KpiCard color="blue" label="UI AUTOMATED" value={detail.module.current.uiAutomated} /></Grid>
                <Grid item xs={6} md={3}><KpiCard color="teal" label="API AUTOMATED" value={detail.module.current.apiAutomated} /></Grid>
                <Grid item xs={6} md={3}><KpiCard color="orange" label="REMAINING" value={detail.module.current.remaining} /></Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <Card sx={{ p: 2, height: 300 }}>
                    <Typography variant="h6">Daily automation trend</Typography>
                    <ResponsiveContainer width="100%" height={230}>
                      <LineChart data={detail.trend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line dataKey="uiAutomated" name="UI" stroke="#2563eb" />
                        <Line dataKey="apiAutomated" name="API" stroke="#0d9488" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Card sx={{ p: 2, height: 300 }}>
                    <Typography variant="h6">Sprint-wise progress</Typography>
                    <ResponsiveContainer width="100%" height={230}>
                      <BarChart data={detail.sprints}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="sprintName" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="inSprintAutomated" name="In-Sprint" fill="#2563eb" />
                        <Bar dataKey="backlogAutomated" name="Backlog" fill="#ea580c" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>
              </Grid>
              <Typography variant="h6">QA contributors</Typography>
              {detail.contributors.map((c: any) => (
                <Typography key={c.userId}>{c.name}: {c.totalAutomated} automated (UI {c.uiAutomated}, API {c.apiAutomated})</Typography>
              ))}
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
