import { Box, Card, LinearProgress, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { DeltaKpiCard, KpiCard } from "./KpiCard";
import { pctOrNA, signed } from "../projects";
import type { DashboardData } from "../types";

export function KpiGrid({ children, min = 220 }: { children: ReactNode; min?: number }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: `repeat(auto-fit, minmax(${min}px, 1fr))` },
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
}

export function ProjectHealthCards({ dash, combined = false }: { dash: DashboardData; combined?: boolean }) {
  const k = dash.kpis;
  const wc = dash.weekComparison;
  const auto = wc?.totalAutomated;
  return (
    <KpiGrid>
      <DeltaKpiCard color="slate" label={combined ? "TOTAL TEST CASES (COMBINED)" : "TOTAL TEST CASES"} current={k.totalTestCases} previous={undefined} change="—" extra="Inventory" />
      <DeltaKpiCard color="purple" label="MANUAL TEST CASES WRITTEN" current={k.manualWritten} previous={wc?.manualWritten.previous} change={signed(wc?.manualWritten.change)} changePct={wc?.manualWritten.changePct == null ? "N/A" : `${wc.manualWritten.changePct}%`} />
      <DeltaKpiCard color="green" label="AUTOMATED TEST CASES" current={k.totalAutomated} previous={auto?.previous} change={signed(auto?.change)} changePct={auto?.changePct == null ? "N/A" : `${auto.changePct}%`} extra={`Coverage ${pctOrNA(k.totalAutomated, k.totalTestCases)}`} />
      <KpiCard color="orange" label="AUTOMATION %" value={pctOrNA(k.totalAutomated, k.totalTestCases)} hint={k.countingMode === "unique_test_cases" ? "Automated / Total TC" : "Configured counting model"} />
      <KpiCard color="slate" label="BACKLOG TEST CASES" value={k.remaining} hint="Total TC − Automated" />
      <DeltaKpiCard color="orange" label="BACKLOG AUTOMATED" current={k.backlogAutomated} previous={wc?.backlogAutomated.previous} change={signed(wc?.backlogAutomated.change)} changePct={wc?.backlogAutomated.changePct == null ? "N/A" : `${wc.backlogAutomated.changePct}%`} />
      <DeltaKpiCard color="blue" label="SPRINT AUTOMATION" current={k.inSprintAutomated} previous={wc?.inSprintAutomated.previous} change={signed(wc?.inSprintAutomated.change)} changePct={wc?.inSprintAutomated.changePct == null ? "N/A" : `${wc.inSprintAutomated.changePct}%`} />
      <DeltaKpiCard color="teal" label="APIS RECORDED" current={k.apiRecorded} previous={wc?.apiRecorded.previous} change={signed(wc?.apiRecorded.change)} changePct={wc?.apiRecorded.changePct == null ? "N/A" : `${wc.apiRecorded.changePct}%`} />
      <DeltaKpiCard color="teal" label="APIS AUTOMATED" current={k.apiAutomated} previous={wc?.apiAutomated.previous} change={signed(wc?.apiAutomated.change)} changePct={wc?.apiAutomated.changePct == null ? "N/A" : `${wc.apiAutomated.changePct}%`} extra={`API ${pctOrNA(k.apiAutomated, k.apiRecorded)}`} />
      <KpiCard color="green" label="TEST EXECUTION PASS %" value={pctOrNA(k.passed, k.testCasesExecuted)} hint={k.testCasesExecuted ? `${k.passed}/${k.testCasesExecuted} passed` : "Not Available"} />
      <KpiCard color="rose" label="OPEN DEFECTS" value={k.openDefects ?? 0} hint={`Closed ${dash.defects?.closed ?? 0}`} />
      <KpiCard color="rose" label="CRITICAL / HIGH DEFECTS" value={k.criticalHighDefects ?? 0} hint={`C ${dash.defects?.critical ?? 0} · H ${dash.defects?.high ?? 0}`} />
    </KpiGrid>
  );
}

export function FlowSteps({ steps }: { steps: Array<{ label: string; value: string | number }> }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: `repeat(${Math.min(steps.length, 5)}, minmax(0, 1fr))` }, gap: 1.5 }}>
      {steps.map((step, i) => (
        <Card key={step.label} sx={{ p: 2, textAlign: "center", bgcolor: i === steps.length - 1 ? "#ecfdf5" : "white" }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
            {i + 1}. {step.label}
          </Typography>
          <Typography variant="h5">{step.value}</Typography>
        </Card>
      ))}
    </Box>
  );
}

export function Meter({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total ? Math.min(100, Math.round((value / total) * 1000) / 10) : 0;
  return (
    <Stack spacing={0.8}>
      <Stack direction="row" justifyContent="space-between">
        <Typography fontWeight={700}>{label}</Typography>
        <Typography>{total ? `${pct}%` : "N/A"}</Typography>
      </Stack>
      <LinearProgress variant="determinate" value={total ? pct : 0} sx={{ height: 12, borderRadius: 99 }} />
      <Typography variant="caption" color="text.secondary">
        {value} / {total || "Not Available"}
      </Typography>
    </Stack>
  );
}

export function HighlightsPanel({ dash, project }: { dash: DashboardData; project?: string }) {
  const highlights = dash.config.weeklyHighlights;
  const selected = project === "Force" || project === "Connect" ? project : "";
  const block = (key: "thisWeek" | "nextWeek" | "attention") => {
    if (selected) return highlights?.[selected]?.[key] || "";
    const connect = highlights?.Connect?.[key] || "";
    const force = highlights?.Force?.[key] || "";
    if (!connect && !force) return "";
    return [connect && `Connect:\n${connect}`, force && `Force:\n${force}`].filter(Boolean).join("\n\n");
  };
  const thisWeek = block("thisWeek") || dash.config.clientAchievements;
  const nextWeek = block("nextWeek") || dash.config.clientFocus;
  const attention = block("attention") || dash.config.clientRisks;
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: 2 }}>
      <Card sx={{ p: 2.5, background: "linear-gradient(135deg,#ecfeff,#ffffff)" }}>
        <Typography variant="h6">This Week — Highlights</Typography>
        <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>{thisWeek || "Not Available. Add highlights in Administration."}</Typography>
      </Card>
      <Card sx={{ p: 2.5, background: "linear-gradient(135deg,#f5f3ff,#ffffff)" }}>
        <Typography variant="h6">Next Week — Planned</Typography>
        <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>{nextWeek || "Not Available. Add planned work in Administration."}</Typography>
      </Card>
      <Card sx={{ p: 2.5, background: "linear-gradient(135deg,#fff7ed,#ffffff)" }}>
        <Typography variant="h6">Client Attention Required</Typography>
        <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>{attention || "Not Available."}</Typography>
      </Card>
    </Box>
  );
}
