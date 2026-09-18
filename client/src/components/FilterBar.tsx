import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import type { ReactNode } from "react";
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

function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <FormControl fullWidth size="small" sx={{ minWidth: 0 }}>
      <InputLabel id={`${id}-label`} shrink htmlFor={id}>
        {label}
      </InputLabel>
      <Select
        id={id}
        labelId={`${id}-label`}
        label={label}
        notched
        displayEmpty
        value={value}
        onChange={(e) => onChange(String(e.target.value))}
        sx={{
          "& .MuiSelect-select": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      >
        {children}
      </Select>
    </FormControl>
  );
}

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
  const qaValue = users.some((u) => u.id === filters.userId) ? filters.userId : "";
  const moduleValue = modules.some((m) => m.id === filters.moduleId) ? filters.moduleId : "";
  const sprintValue = sprints.some((s) => s.id === filters.sprintId) ? filters.sprintId : "";
  const qaUsers = users.filter((u) => u.role !== "admin");

  return (
    <Stack spacing={1.5} className="no-print">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(5, minmax(0, 1fr))",
          },
          gap: 1.5,
          alignItems: "center",
          width: "100%",
        }}
      >
        <FilterSelect id="period" label="Period" value={filters.preset || "this_week"} onChange={(value) => set({ preset: value })}>
          {presets.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.label}
            </MenuItem>
          ))}
        </FilterSelect>
        {filters.preset === "custom" && (
          <>
            <TextField size="small" type="date" label="From" InputLabelProps={{ shrink: true }} value={filters.startDate} onChange={(e) => set({ startDate: e.target.value })} />
            <TextField size="small" type="date" label="To" InputLabelProps={{ shrink: true }} value={filters.endDate} onChange={(e) => set({ endDate: e.target.value })} />
          </>
        )}
        {!hideQa && (
          <FilterSelect id="qa" label="QA" value={qaValue} onChange={(value) => set({ userId: value })}>
            <MenuItem value="">All QA</MenuItem>
            {qaUsers.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name}
              </MenuItem>
            ))}
            {qaUsers.length === 0 && <MenuItem disabled value="__empty">No QA names yet — add them on Daily Update</MenuItem>}
          </FilterSelect>
        )}
        <FilterSelect id="module" label="Module" value={moduleValue} onChange={(value) => set({ moduleId: value })}>
          <MenuItem value="">All Modules</MenuItem>
          {modules.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.name}
            </MenuItem>
          ))}
          {modules.length === 0 && <MenuItem disabled value="__empty">No modules yet — add them on Daily Update</MenuItem>}
        </FilterSelect>
        <FilterSelect id="sprint" label="Sprint" value={sprintValue} onChange={(value) => set({ sprintId: value })}>
          <MenuItem value="">All Sprints</MenuItem>
          {sprints.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.sprintName}
            </MenuItem>
          ))}
          {sprints.length === 0 && <MenuItem disabled value="__empty">No sprints yet — add them on Daily Update</MenuItem>}
        </FilterSelect>
        <FilterSelect id="automation-type" label="Automation Type" value={filters.automationType || ""} onChange={(value) => set({ automationType: value })}>
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="in_sprint">In-Sprint</MenuItem>
          <MenuItem value="backlog">Backlog</MenuItem>
          <MenuItem value="ui">UI</MenuItem>
          <MenuItem value="api">API</MenuItem>
        </FilterSelect>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={onRefresh} sx={{ height: 40, whiteSpace: "nowrap", px: 2.5 }}>
          Refresh Dashboard
        </Button>
      </Box>
    </Stack>
  );
}
