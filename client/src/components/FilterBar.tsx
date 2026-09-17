import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import type { Filters, Module, Sprint, User } from "../types";

const presets = [
  { id: "today", label: "Today" },
  { id: "this_week", label: "This Week" },
  { id: "last_week", label: "Last Week" },
  { id: "current_sprint", label: "Current Sprint" },
  { id: "last_sprint", label: "Last Sprint" },
  { id: "this_month", label: "This Month" },
  { id: "last_month", label: "Last Month" },
  { id: "custom", label: "Custom Date Range" },
];

export function FilterBar({
  filters,
  onChange,
  onRefresh,
  users,
  modules,
  sprints,
  hideQa = false,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  onRefresh: () => void;
  users: User[];
  modules: Module[];
  sprints: Sprint[];
  hideQa?: boolean;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  return (
    <Stack spacing={1.5} className="no-print">
      <Stack direction={{ xs: "column", lg: "row" }} spacing={1.5} alignItems={{ lg: "center" }}>
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Period</InputLabel>
          <Select value={filters.preset} label="Period" onChange={(e) => set({ preset: e.target.value })}>
            {presets.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {filters.preset === "custom" && (
          <>
            <TextField size="small" type="date" label="From" InputLabelProps={{ shrink: true }} value={filters.startDate} onChange={(e) => set({ startDate: e.target.value })} />
            <TextField size="small" type="date" label="To" InputLabelProps={{ shrink: true }} value={filters.endDate} onChange={(e) => set({ endDate: e.target.value })} />
          </>
        )}
        {!hideQa && (
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>QA</InputLabel>
            <Select value={filters.userId} label="QA" onChange={(e) => set({ userId: e.target.value })}>
              <MenuItem value="">All QA</MenuItem>
              {users.filter((u) => u.role !== "admin").map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Module</InputLabel>
          <Select value={filters.moduleId} label="Module" onChange={(e) => set({ moduleId: e.target.value })}>
            <MenuItem value="">All Modules</MenuItem>
            {modules.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sprint</InputLabel>
          <Select value={filters.sprintId} label="Sprint" onChange={(e) => set({ sprintId: e.target.value })}>
            <MenuItem value="">All Sprints</MenuItem>
            {sprints.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.sprintName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Automation Type</InputLabel>
          <Select value={filters.automationType} label="Automation Type" onChange={(e) => set({ automationType: e.target.value })}>
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="in_sprint">In-Sprint</MenuItem>
            <MenuItem value="backlog">Backlog</MenuItem>
            <MenuItem value="ui">UI</MenuItem>
            <MenuItem value="api">API</MenuItem>
          </Select>
        </FormControl>
        <Box flex={1} />
        <Button variant="contained" onClick={onRefresh}>
          Refresh Dashboard
        </Button>
      </Stack>
    </Stack>
  );
}
