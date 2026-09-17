import {
  Alert,
  Autocomplete,
  Button,
  Card,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { listUpdates, lookupUpdate, resolveQaName, saveUpdate, saveUser } from "../api/client";
import { useApp } from "../appState";
import { useAuth } from "../auth";
import { emptyDailyUpdate, type DailyUpdate } from "../types";

const numberFields: Array<{ key: keyof DailyUpdate; label: string; group: string }> = [
  { key: "inSprintAutomated", label: "In-sprint test cases automated today", group: "Daily Automation" },
  { key: "backlogAutomated", label: "Backlog test cases automated today", group: "Daily Automation" },
  { key: "uiAutomated", label: "UI test cases automated today", group: "Daily Automation" },
  { key: "apiAutomated", label: "API test cases automated today", group: "Daily Automation" },
  { key: "manualWritten", label: "Manual test cases written today", group: "Manual Testing" },
  { key: "testCasesExecuted", label: "Test cases executed today", group: "Manual Testing" },
  { key: "passed", label: "Passed", group: "Manual Testing" },
  { key: "failed", label: "Failed", group: "Manual Testing" },
  { key: "blocked", label: "Blocked", group: "Manual Testing" },
  { key: "apisRecorded", label: "APIs recorded today", group: "API Work" },
  { key: "defectsRaised", label: "Defects raised", group: "Defects" },
  { key: "criticalDefects", label: "Critical", group: "Defects" },
  { key: "highDefects", label: "High", group: "Defects" },
  { key: "mediumDefects", label: "Medium", group: "Defects" },
  { key: "lowDefects", label: "Low", group: "Defects" },
  { key: "defectsClosed", label: "Defects closed", group: "Defects" },
];

export function DailyUpdatePage() {
  const { user } = useAuth();
  const { users, modules, sprints, workTypes, filters, refresh } = useApp();
  const [form, setForm] = useState(() => ({
    ...emptyDailyUpdate(),
    date: dayjs().format("YYYY-MM-DD"),
    userId: user?.role === "qa" ? user.id : "",
  }));
  const [rows, setRows] = useState<DailyUpdate[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [existing, setExisting] = useState(false);
  const [busy, setBusy] = useState(false);
  const qaOptions = users.filter((u) => u.role !== "admin");
  const selectedQa = qaOptions.find((u) => u.id === form.userId) || null;
  const [qaName, setQaName] = useState(selectedQa?.name || (user?.role === "qa" ? user.name : ""));

  const set = (patch: Partial<DailyUpdate>) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    listUpdates().then(setRows);
  }, []);

  useEffect(() => {
    if (!form.date || !form.userId || !form.moduleId || !form.userStory) {
      setExisting(false);
      return;
    }
    lookupUpdate({
      date: form.date,
      userId: form.userId,
      moduleId: form.moduleId,
      userStory: form.userStory,
    }).then((found) => {
      if (found) {
        setForm((prev) => ({ ...prev, ...found }));
        setQaName(found.qaName || qaName);
        setExisting(true);
      } else {
        setExisting(false);
      }
    });
  }, [form.date, form.userId, form.moduleId, form.userStory]);

  const groups = useMemo(() => {
    return [...new Set(numberFields.map((f) => f.group))];
  }, []);

  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", width: 120 },
    { field: "qaName", headerName: "QA", width: 150 },
    { field: "moduleName", headerName: "Module", flex: 1, minWidth: 180 },
    { field: "sprintName", headerName: "Sprint", width: 120 },
    { field: "userStory", headerName: "User Story", width: 130 },
    { field: "workType", headerName: "Work Type", width: 180 },
    { field: "dailyTotal", headerName: "Daily Total", width: 110 },
    { field: "uiAutomated", headerName: "UI", width: 80 },
    { field: "apiAutomated", headerName: "API", width: 80 },
  ];

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4">Daily Update</Typography>
      <Typography color="text.secondary">
        One record is kept for the same Date + QA + Module + User Story. Saving again updates the existing entry.
      </Typography>
      <Card sx={{ p: 3 }}>
        <Stack
          spacing={2}
          component="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            setMessage("");
            try {
              if (!qaName.trim()) {
                setError("QA name is mandatory.");
                return;
              }
              const currentQa = qaOptions.find((u) => u.id === form.userId);
              let resolved;
              if (currentQa && currentQa.name.trim().toLowerCase() !== qaName.trim().toLowerCase()) {
                resolved = await saveUser({ name: qaName.trim() }, currentQa.id);
              } else {
                resolved = await resolveQaName(qaName.trim());
              }
              const result = await saveUpdate({ ...form, userId: resolved.id }, filters);
              set({ userId: resolved.id, qaName: resolved.name });
              setQaName(resolved.name);
              setMessage(result.replaced ? "Existing daily update was refreshed with the latest values." : "Daily update saved. Dashboards will refresh now.");
              setExisting(true);
              const next = await listUpdates();
              setRows(next);
              await refresh();
            } catch (err: any) {
              setError(err?.response?.data?.message || "Unable to save this update.");
            } finally {
              setBusy(false);
            }
          }}
        >
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          {existing && <Alert severity="info">An entry already exists for this date, QA, module, and user story. Your save will update it.</Alert>}
          <Alert severity="info">
            Daily total (In-Sprint + Backlog): {Number(form.inSprintAutomated || 0) + Number(form.backlogAutomated || 0)}
          </Alert>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} value={form.date} onChange={(e) => set({ date: e.target.value })} required />
            </Grid>
            <Grid item xs={12} md={3}>
              <Autocomplete
                freeSolo
                options={qaOptions}
                getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}
                value={selectedQa}
                inputValue={qaName}
                onInputChange={(_, value) => setQaName(value)}
                onChange={(_, value) => {
                  if (typeof value === "string") {
                    setQaName(value);
                    return;
                  }
                  if (value) {
                    setQaName(value.name);
                    set({ userId: value.id, qaName: value.name });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="QA Name"
                    required
                    helperText="Type to add or rename. Existing names stay selectable."
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Module</InputLabel>
                <Select label="Module" value={form.moduleId} onChange={(e) => set({ moduleId: e.target.value })}>
                  {modules.map((m) => (
                    <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sprint</InputLabel>
                <Select label="Sprint" value={form.sprintId} onChange={(e) => set({ sprintId: e.target.value })}>
                  {sprints.map((s) => (
                    <MenuItem key={s.id} value={s.id}>{s.sprintName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="User Story" value={form.userStory} onChange={(e) => set({ userStory: e.target.value })} placeholder="US-UM-418" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Work Type</InputLabel>
                <Select label="Work Type" value={form.workType} onChange={(e) => set({ workType: e.target.value })}>
                  {workTypes.map((w) => (
                    <MenuItem key={w} value={w}>{w}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {groups.map((group) => (
            <Stack key={group} spacing={1.5}>
              <Divider />
              <Typography variant="h6">{group}</Typography>
              <Grid container spacing={2}>
                {numberFields.filter((f) => f.group === group).map((field) => (
                  <Grid item xs={12} sm={6} md={3} key={field.key}>
                    <TextField
                      fullWidth
                      type="number"
                      label={field.label}
                      inputProps={{ min: 0 }}
                      value={form[field.key] as number}
                      onChange={(e) => set({ [field.key]: Number(e.target.value || 0) } as Partial<DailyUpdate>)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          ))}

          <TextField
            label="Daily Comments / Achievements"
            multiline
            minRows={3}
            value={form.comments}
            onChange={(e) => set({ comments: e.target.value })}
            placeholder="Automated 8 backlog test cases for User Management and completed API validation for 3 endpoints."
          />
          <Stack direction="row" spacing={1.5}>
            <Button type="submit" variant="contained" disabled={busy}>
              {existing ? "Update Daily Entry" : "Save Daily Update"}
            </Button>
            <Button
              onClick={() => {
                setForm({
                  ...emptyDailyUpdate(),
                  date: dayjs().format("YYYY-MM-DD"),
                  userId: user?.role === "qa" ? user.id : "",
                });
                setQaName(user?.role === "qa" ? user.name : "");
                setExisting(false);
                setMessage("");
                setError("");
              }}
            >
              Clear
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Card sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Recent entries</Typography>
        <div style={{ height: 420 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            onRowClick={(params) => {
              const row = params.row as DailyUpdate;
              setForm(row);
              setQaName(row.qaName || "");
              setExisting(true);
            }}
          />
        </div>
      </Card>
    </Stack>
  );
}
