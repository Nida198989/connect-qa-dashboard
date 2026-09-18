import { Alert, Button, Card, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { downloadCsv, downloadExcel, getBimonthly, getWeekly } from "../api/client";
import { KpiCard } from "../components/KpiCard";
import { useApp } from "../appState";
import { useAuth } from "../auth";

dayjs.extend(isoWeek);

function delta(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

export function ReportsPage() {
  const { user } = useAuth();
  const { filters } = useApp();
  const [weekStart, setWeekStart] = useState(dayjs().startOf("isoWeek").format("YYYY-MM-DD"));
  const [biStart, setBiStart] = useState(dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD"));
  const [biEnd, setBiEnd] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));
  const [weekly, setWeekly] = useState<any>(null);
  const [bimonthly, setBimonthly] = useState<any>(null);
  const [error, setError] = useState("");

  async function loadWeekly(next = weekStart) {
    setWeekly(await getWeekly(next));
  }
  async function loadBi() {
    setBimonthly(await getBimonthly(biStart, biEnd));
  }

  useEffect(() => {
    loadWeekly().catch((e) => setError(e?.response?.data?.message || "Unable to load weekly report."));
    loadBi().catch((e) => setError(e?.response?.data?.message || "Unable to load bimonthly report."));
  }, []);

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4">Reports</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction="row" spacing={1.5} className="no-print">
        {(user?.role === "lead" || user?.role === "admin") && (
          <>
            <Button variant="contained" onClick={() => downloadExcel(filters)}>Export Weekly Report</Button>
            <Button variant="outlined" onClick={() => downloadExcel(filters)}>Export Excel</Button>
            <Button variant="outlined" onClick={() => downloadCsv(filters)}>Export CSV</Button>
          </>
        )}
        <Button variant="outlined" onClick={() => window.print()}>Print Client Report</Button>
      </Stack>

      <Card sx={{ p: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} sx={{ mb: 2 }}>
          <Typography variant="h6">Weekly Status</Typography>
          <TextField
            type="date"
            label="Week of"
            InputLabelProps={{ shrink: true }}
            value={weekStart}
            onChange={(e) => {
              const next = dayjs(e.target.value).startOf("isoWeek").format("YYYY-MM-DD");
              setWeekStart(next);
              loadWeekly(next);
            }}
          />
        </Stack>
        {weekly && (
          <Stack spacing={2}>
            <Typography color="text.secondary">
              Week: {dayjs(weekly.thisWeek.start).format("DD-MMM-YYYY")} → {dayjs(weekly.thisWeek.end).format("DD-MMM-YYYY")}
            </Typography>
            <Typography variant="subtitle1">This Week</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={2}><KpiCard color="blue" label="AUTOMATED" value={weekly.current.totalAutomated} /></Grid>
              <Grid item xs={6} md={2}><KpiCard color="purple" label="IN-SPRINT" value={weekly.current.inSprintAutomated} /></Grid>
              <Grid item xs={6} md={2}><KpiCard color="orange" label="BACKLOG" value={weekly.current.backlogAutomated} /></Grid>
              <Grid item xs={6} md={2}><KpiCard color="teal" label="UI" value={weekly.current.uiAutomated} /></Grid>
              <Grid item xs={6} md={2}><KpiCard color="green" label="API" value={weekly.current.apiAutomated} /></Grid>
              <Grid item xs={6} md={2}><KpiCard color="slate" label="MANUAL WRITTEN" value={weekly.current.manualWritten} /></Grid>
              <Grid item xs={6} md={2}><KpiCard color="teal" label="APIS RECORDED" value={weekly.current.apisRecorded} /></Grid>
              <Grid item xs={6} md={2}><KpiCard color="rose" label="DEFECTS RAISED" value={weekly.current.defectsRaised} /></Grid>
              <Grid item xs={6} md={2}><KpiCard color="green" label="DEFECTS CLOSED" value={weekly.current.defectsClosed} /></Grid>
            </Grid>
            <Typography variant="subtitle1">Previous Week</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={2}><KpiCard color="slate" label="AUTOMATED" value={weekly.previous.totalAutomated} /></Grid>
              <Grid item xs={6} md={2}><KpiCard color="purple" label="IN-SPRINT" value={weekly.previous.inSprintAutomated} /></Grid>
              <Grid item xs={6} md={2}><KpiCard color="orange" label="BACKLOG" value={weekly.previous.backlogAutomated} /></Grid>
              <Grid item xs={6} md={2}><KpiCard color="teal" label="UI" value={weekly.previous.uiAutomated} /></Grid>
              <Grid item xs={6} md={2}><KpiCard color="green" label="API" value={weekly.previous.apiAutomated} /></Grid>
              <Grid item xs={6} md={2}><KpiCard color="slate" label="MANUAL WRITTEN" value={weekly.previous.manualWritten} /></Grid>
            </Grid>
            <Typography variant="subtitle1">Change</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><KpiCard color={weekly.change.totalAutomated >= 0 ? "green" : "rose"} label="AUTOMATION CHANGE" value={delta(weekly.change.totalAutomated)} /></Grid>
              <Grid item xs={12} md={4}><KpiCard color={weekly.change.apiAutomated >= 0 ? "teal" : "rose"} label="API AUTOMATION CHANGE" value={delta(weekly.change.apiAutomated)} /></Grid>
              <Grid item xs={12} md={4}><KpiCard color={weekly.change.manualWritten >= 0 ? "purple" : "rose"} label="MANUAL DESIGN CHANGE" value={delta(weekly.change.manualWritten)} /></Grid>
            </Grid>
          </Stack>
        )}
      </Card>

      <Card sx={{ p: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} sx={{ mb: 2 }}>
          <Typography variant="h6">Bimonthly Reporting</Typography>
          <TextField select label="Preset" value={`${biStart}|${biEnd}`} onChange={(e) => {
            const [start, end] = e.target.value.split("|");
            setBiStart(start);
            setBiEnd(end);
            getBimonthly(start, end).then(setBimonthly);
          }} sx={{ minWidth: 220 }}>
            <MenuItem value={`${dayjs().subtract(2, "month").startOf("month").format("YYYY-MM-DD")}|${dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD")}`}>
              Previous two months
            </MenuItem>
            <MenuItem value={`${dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD")}|${dayjs().endOf("month").format("YYYY-MM-DD")}`}>
              Last month + this month
            </MenuItem>
            <MenuItem value={`${biStart}|${biEnd}`}>Custom</MenuItem>
          </TextField>
          <TextField type="date" label="From" InputLabelProps={{ shrink: true }} value={biStart} onChange={(e) => setBiStart(e.target.value)} />
          <TextField type="date" label="To" InputLabelProps={{ shrink: true }} value={biEnd} onChange={(e) => setBiEnd(e.target.value)} />
          <Button variant="contained" onClick={loadBi}>Apply Range</Button>
        </Stack>
        {bimonthly && (
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}><KpiCard color="slate" label="STARTING AUTOMATION" value={bimonthly.startingAutomation} /></Grid>
              <Grid item xs={6} md={3}><KpiCard color="blue" label="AUTOMATION ADDED" value={bimonthly.automationAdded} /></Grid>
              <Grid item xs={6} md={3}><KpiCard color="green" label="ENDING AUTOMATION" value={bimonthly.endingAutomation} /></Grid>
              <Grid item xs={6} md={3}><KpiCard color="purple" label="UI ADDED" value={bimonthly.uiAdded} /></Grid>
              <Grid item xs={6} md={3}><KpiCard color="teal" label="API ADDED" value={bimonthly.apiAdded} /></Grid>
              <Grid item xs={6} md={3}><KpiCard color="orange" label="MANUAL ADDED" value={bimonthly.manualAdded} /></Grid>
              <Grid item xs={6} md={3}><KpiCard color="teal" label="API RECORDING" value={bimonthly.apisRecordedAdded} /></Grid>
              <Grid item xs={6} md={3}><KpiCard color="rose" label="DEFECTS" value={`${bimonthly.defectsRaised} / ${bimonthly.defectsClosed}`} /></Grid>
            </Grid>
            <Card sx={{ p: 2, height: 320 }}>
              <Typography variant="h6">Trend across selected period</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={bimonthly.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="totalAutomated" name="Automated" stroke="#2563eb" />
                  <Line dataKey="uiAutomated" name="UI" stroke="#7c3aed" />
                  <Line dataKey="apiAutomated" name="API" stroke="#0d9488" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Stack>
        )}
      </Card>
    </Stack>
  );
}
