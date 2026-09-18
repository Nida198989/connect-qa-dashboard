const { seed } = require("./seed");
const { buildDashboard } = require("./analytics");
const { DEFAULT_CONFIG } = require("./constants");

const db = seed();
const live = buildDashboard(db, { preset: "this_week" });

const checks = [
  ["Empty modules", db.modules.length, 0],
  ["Empty sprints", db.sprints.length, 0],
  ["Empty daily updates", db.dailyUpdates.length, 0],
  ["Empty total TC", live.kpis.totalTestCases, 0],
  ["Empty UI automated", live.kpis.uiAutomated, 0],
  ["Login users remain", db.users.length > 0, true],
];

let failed = 0;
for (const [label, actual, expected] of checks) {
  const ok = actual === expected;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${actual} ${ok ? "" : `(expected ${expected})`}`);
  if (!ok) failed += 1;
}
if (failed) process.exitCode = 1;
else console.log("Empty team-owned data set is ready.");
