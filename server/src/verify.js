const { seed } = require("./seed");
const { buildDashboard, weeklyStatus, bimonthly, overallKpis } = require("./analytics");
const { DEFAULT_CONFIG, BASELINE_MODULES } = require("./constants");

const db = seed();
const baselineUi = BASELINE_MODULES.reduce((a, m) => a + m.uiAutomated, 0);
const baselineApi = BASELINE_MODULES.reduce((a, m) => a + m.apiAutomated, 0);
const baselineTc = BASELINE_MODULES.reduce((a, m) => a + m.totalTestCases, 0);
const kpis = overallKpis(db.modules, [], DEFAULT_CONFIG);
const live = buildDashboard(db, { preset: "this_week" });
const week = weeklyStatus(db.dailyUpdates, "2026-09-14");
const bi = bimonthly(db.modules, db.dailyUpdates, "2026-08-01", "2026-09-17", DEFAULT_CONFIG);

const checks = [
  ["Baseline total TC", baselineTc, 1058],
  ["Baseline UI", baselineUi, 434],
  ["Baseline API", baselineApi, 59],
  ["Baseline KPIs match seed", kpis.totalTestCases, 1058],
  ["Live KPIs keep baseline TC", live.kpis.totalTestCases, 1058],
  ["Live UI >= baseline", live.kpis.uiAutomated >= 434, true],
  ["No double count in unique mode", live.kpis.totalAutomated, live.kpis.uiAutomated],
  ["Weekly current has data", week.current.totalAutomated > 0, true],
  ["Bimonthly ending >= starting", bi.endingAutomation >= bi.startingAutomation, true],
];

let failed = 0;
for (const [label, actual, expected] of checks) {
  const ok = actual === expected;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${actual} ${ok ? "" : `(expected ${expected})`}`);
  if (!ok) failed += 1;
}
if (failed) {
  process.exitCode = 1;
} else {
  console.log("All calculation checks passed.");
  console.log({
    totalTC: live.kpis.totalTestCases,
    ui: live.kpis.uiAutomated,
    api: live.kpis.apiAutomated,
    coverage: live.kpis.automationCoverage,
    inSprint: live.kpis.inSprintAutomated,
    backlog: live.kpis.backlogAutomated,
  });
}
