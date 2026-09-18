// @ts-nocheck
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isoWeek);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const DEFAULT_CONFIG = {
  countingMode: "unique_test_cases",
  thresholds: { green: 80, amber: 50, orange: 20 },
  currentSprintId: "",
  clientFocus: "",
  clientRisks: "",
  clientAchievements: "",
};

export function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function pct(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 1000) / 10;
}

function coverageStatus(coverage, thresholds = DEFAULT_CONFIG.thresholds) {
  if (coverage >= thresholds.green) return { label: "On Track", tone: "green" };
  if (coverage >= thresholds.amber) return { label: "Watch", tone: "amber" };
  if (coverage >= thresholds.orange) return { label: "At Risk", tone: "orange" };
  return { label: "Critical", tone: "red" };
}

function resolveRange(filters, sprints, config) {
  const today = dayjs();
  const currentSprint =
    sprints.find((s) => s.id === (filters.sprintId || config.currentSprintId)) ||
    sprints.find((s) => today.isSameOrAfter(dayjs(s.startDate), "day") && today.isSameOrBefore(dayjs(s.endDate), "day")) ||
    sprints[sprints.length - 1];
  const currentIndex = sprints.findIndex((s) => s.id === currentSprint?.id);
  const lastSprint = currentIndex > 0 ? sprints[currentIndex - 1] : currentSprint;

  switch (filters.preset) {
    case "today":
      return { start: today.format("YYYY-MM-DD"), end: today.format("YYYY-MM-DD"), label: "Today" };
    case "this_week":
      return { start: today.startOf("isoWeek").format("YYYY-MM-DD"), end: today.endOf("isoWeek").format("YYYY-MM-DD"), label: "This Week" };
    case "last_week": {
      const last = today.subtract(1, "week");
      return { start: last.startOf("isoWeek").format("YYYY-MM-DD"), end: last.endOf("isoWeek").format("YYYY-MM-DD"), label: "Last Week" };
    }
    case "current_sprint":
      return {
        start: currentSprint?.startDate || today.startOf("isoWeek").format("YYYY-MM-DD"),
        end: currentSprint?.endDate || today.endOf("isoWeek").format("YYYY-MM-DD"),
        label: currentSprint?.sprintName || "Current Sprint",
      };
    case "last_sprint":
      return {
        start: lastSprint?.startDate || today.subtract(1, "week").startOf("isoWeek").format("YYYY-MM-DD"),
        end: lastSprint?.endDate || today.subtract(1, "week").endOf("isoWeek").format("YYYY-MM-DD"),
        label: lastSprint?.sprintName || "Last Sprint",
      };
    case "this_month":
      return { start: today.startOf("month").format("YYYY-MM-DD"), end: today.endOf("month").format("YYYY-MM-DD"), label: "This Month" };
    case "last_month": {
      const last = today.subtract(1, "month");
      return { start: last.startOf("month").format("YYYY-MM-DD"), end: last.endOf("month").format("YYYY-MM-DD"), label: "Last Month" };
    }
    default:
      return {
        start: filters.startDate || today.subtract(30, "day").format("YYYY-MM-DD"),
        end: filters.endDate || today.format("YYYY-MM-DD"),
        label: "Custom Range",
      };
  }
}

function inRange(date, range) {
  if (!range?.start || !range?.end) return true;
  const d = dayjs(date);
  return d.isSameOrAfter(dayjs(range.start), "day") && d.isSameOrBefore(dayjs(range.end), "day");
}

function filterUpdates(updates, filters = {}, range) {
  return updates.filter((row) => {
    if (range && !inRange(row.date, range)) return false;
    if (filters.userId && row.userId !== filters.userId) return false;
    if (filters.moduleId && row.moduleId !== filters.moduleId) return false;
    if (filters.sprintId && row.sprintId !== filters.sprintId) return false;
    if (filters.automationType === "ui" && num(row.uiAutomated) <= 0) return false;
    if (filters.automationType === "api" && num(row.apiAutomated) <= 0) return false;
    if (filters.automationType === "in_sprint" && num(row.inSprintAutomated) <= 0) return false;
    if (filters.automationType === "backlog" && num(row.backlogAutomated) <= 0) return false;
    return true;
  });
}

function sumField(rows, field) {
  return rows.reduce((acc, row) => acc + num(row[field]), 0);
}

function dailyTotal(row) {
  return num(row.inSprintAutomated) + num(row.backlogAutomated);
}

function computeTotalAutomated(uiAutomated, apiAutomated, countingMode) {
  if (countingMode === "separate_assets") return uiAutomated + apiAutomated;
  if (countingMode === "unique_max") return Math.max(uiAutomated, apiAutomated);
  return uiAutomated;
}

export function moduleSnapshot(mod, allUpdates, config) {
  const rows = allUpdates.filter((u) => u.moduleId === mod.id);
  const uiAutomated = num(mod.uiAutomated) + sumField(rows, "uiAutomated");
  const apiAutomated = num(mod.apiAutomated) + sumField(rows, "apiAutomated");
  const apiRecorded = num(mod.apiRecorded) + sumField(rows, "apisRecorded");
  const manualWritten = num(mod.manualWritten) + sumField(rows, "manualWritten");
  const inSprintAutomated = sumField(rows, "inSprintAutomated");
  const backlogAutomated = sumField(rows, "backlogAutomated");
  const totalAutomated = computeTotalAutomated(uiAutomated, apiAutomated, config.countingMode);
  const remaining = Math.max(0, num(mod.totalTestCases) - totalAutomated);
  const coverage = pct(totalAutomated, mod.totalTestCases);
  return {
    ...mod,
    current: {
      totalTestCases: num(mod.totalTestCases),
      manualWritten,
      uiAutomated,
      apiAutomated,
      apiRecorded,
      inSprintAutomated,
      backlogAutomated,
      totalAutomated,
      remaining,
      coverage,
      status: coverageStatus(coverage, config.thresholds),
    },
  };
}

function overallKpis(modules, updates, config) {
  const snapshots = modules.map((m) => moduleSnapshot(m, updates, config));
  const totalTestCases = snapshots.reduce((a, m) => a + m.current.totalTestCases, 0);
  const manualWritten = snapshots.reduce((a, m) => a + m.current.manualWritten, 0);
  const uiAutomated = snapshots.reduce((a, m) => a + m.current.uiAutomated, 0);
  const apiAutomated = snapshots.reduce((a, m) => a + m.current.apiAutomated, 0);
  const apiRecorded = snapshots.reduce((a, m) => a + m.current.apiRecorded, 0);
  const totalAutomated = snapshots.reduce((a, m) => a + m.current.totalAutomated, 0);
  return {
    totalTestCases,
    manualWritten,
    uiAutomated,
    apiAutomated,
    totalAutomated,
    automationCoverage: pct(totalAutomated, totalTestCases),
    apiRecorded,
    apiCoverage: pct(apiAutomated, apiRecorded),
    inSprintAutomated: snapshots.reduce((a, m) => a + m.current.inSprintAutomated, 0),
    backlogAutomated: snapshots.reduce((a, m) => a + m.current.backlogAutomated, 0),
    remaining: Math.max(0, totalTestCases - totalAutomated),
    countingMode: config.countingMode,
  };
}

function periodTotals(updates) {
  return {
    inSprintAutomated: sumField(updates, "inSprintAutomated"),
    backlogAutomated: sumField(updates, "backlogAutomated"),
    uiAutomated: sumField(updates, "uiAutomated"),
    apiAutomated: sumField(updates, "apiAutomated"),
    totalAutomated: updates.reduce((a, r) => a + dailyTotal(r), 0),
    manualWritten: sumField(updates, "manualWritten"),
    testCasesExecuted: sumField(updates, "testCasesExecuted"),
    passed: sumField(updates, "passed"),
    failed: sumField(updates, "failed"),
    blocked: sumField(updates, "blocked"),
    apisRecorded: sumField(updates, "apisRecorded"),
    defectsRaised: sumField(updates, "defectsRaised"),
    defectsClosed: sumField(updates, "defectsClosed"),
    criticalDefects: sumField(updates, "criticalDefects"),
    highDefects: sumField(updates, "highDefects"),
    mediumDefects: sumField(updates, "mediumDefects"),
    lowDefects: sumField(updates, "lowDefects"),
  };
}

function dailyTrend(updates, users) {
  const grouped = {};
  updates.forEach((row) => {
    const key = `${row.date}|${row.userId}`;
    if (!grouped[key]) {
      grouped[key] = {
        date: row.date,
        userId: row.userId,
        qaName: users.find((u) => u.id === row.userId)?.name || "Unknown",
        inSprintAutomated: 0,
        backlogAutomated: 0,
        uiAutomated: 0,
        apiAutomated: 0,
        totalAutomated: 0,
      };
    }
    grouped[key].inSprintAutomated += num(row.inSprintAutomated);
    grouped[key].backlogAutomated += num(row.backlogAutomated);
    grouped[key].uiAutomated += num(row.uiAutomated);
    grouped[key].apiAutomated += num(row.apiAutomated);
    grouped[key].totalAutomated += dailyTotal(row);
  });
  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date) || a.qaName.localeCompare(b.qaName));
}

function chartByDate(updates) {
  const grouped = {};
  updates.forEach((row) => {
    if (!grouped[row.date]) {
      grouped[row.date] = { date: row.date, inSprintAutomated: 0, backlogAutomated: 0, uiAutomated: 0, apiAutomated: 0, totalAutomated: 0 };
    }
    grouped[row.date].inSprintAutomated += num(row.inSprintAutomated);
    grouped[row.date].backlogAutomated += num(row.backlogAutomated);
    grouped[row.date].uiAutomated += num(row.uiAutomated);
    grouped[row.date].apiAutomated += num(row.apiAutomated);
    grouped[row.date].totalAutomated += dailyTotal(row);
  });
  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
}

function inSprintVsBacklog(updates, today = dayjs()) {
  const week = { start: today.startOf("isoWeek").format("YYYY-MM-DD"), end: today.endOf("isoWeek").format("YYYY-MM-DD") };
  const todayRows = updates.filter((u) => u.date === today.format("YYYY-MM-DD"));
  const weekRows = updates.filter((u) => inRange(u.date, week));
  return {
    inSprint: { today: sumField(todayRows, "inSprintAutomated"), week: sumField(weekRows, "inSprintAutomated"), cumulative: sumField(updates, "inSprintAutomated") },
    backlog: { today: sumField(todayRows, "backlogAutomated"), week: sumField(weekRows, "backlogAutomated"), cumulative: sumField(updates, "backlogAutomated") },
  };
}

function teamProgress(updates, users) {
  return users
    .filter((u) => u.role !== "admin")
    .map((user) => {
      const rows = updates.filter((r) => r.userId === user.id);
      const dates = new Set(rows.map((r) => r.date));
      const totalAutomated = rows.reduce((a, r) => a + dailyTotal(r), 0);
      return {
        userId: user.id,
        name: user.name,
        role: user.role,
        inSprintAutomated: sumField(rows, "inSprintAutomated"),
        backlogAutomated: sumField(rows, "backlogAutomated"),
        uiAutomated: sumField(rows, "uiAutomated"),
        apiAutomated: sumField(rows, "apiAutomated"),
        totalAutomated,
        manualWritten: sumField(rows, "manualWritten"),
        dailyAverage: dates.size ? Math.round((totalAutomated / dates.size) * 10) / 10 : 0,
        daysLogged: dates.size,
      };
    });
}

function sprintProgress(sprints, updates, config) {
  return sprints.map((sprint) => {
    const rows = updates.filter((u) => u.sprintId === sprint.id);
    const planned = num(sprint.plannedTestCases);
    const totals = periodTotals(rows);
    const inSprintAutoExecuted = num(sprint.inSprintAutoExecuted);
    const inSprintAutoPassed = num(sprint.inSprintAutoPassed);
    return {
      ...sprint,
      ...totals,
      inSprintAutoExecuted,
      inSprintAutoPassed,
      inSprintAutoFailed: num(sprint.inSprintAutoFailed),
      inSprintAutoBlocked: num(sprint.inSprintAutoBlocked),
      inSprintExecutionNotes: sprint.inSprintExecutionNotes || "",
      inSprintExecutionPassPct: pct(inSprintAutoPassed, inSprintAutoExecuted),
      sprintClosed: Boolean(sprint.endDate) && dayjs().isSameOrAfter(dayjs(sprint.endDate), "day"),
      remaining: Math.max(0, planned - totals.totalAutomated),
      completion: pct(totals.totalAutomated, planned),
      manualPct: pct(totals.manualWritten, planned),
      executionPct: pct(totals.testCasesExecuted, planned),
      status: coverageStatus(pct(totals.totalAutomated, planned), config.thresholds),
    };
  });
}

export function weeklyStatus(updates, weekStart) {
  const start = dayjs(weekStart);
  const thisWeek = { start: start.startOf("isoWeek").format("YYYY-MM-DD"), end: start.endOf("isoWeek").format("YYYY-MM-DD") };
  const prev = start.subtract(1, "week");
  const previousWeek = { start: prev.startOf("isoWeek").format("YYYY-MM-DD"), end: prev.endOf("isoWeek").format("YYYY-MM-DD") };
  const current = periodTotals(updates.filter((u) => inRange(u.date, thisWeek)));
  const previous = periodTotals(updates.filter((u) => inRange(u.date, previousWeek)));
  const change = {};
  Object.keys(current).forEach((key) => {
    change[key] = current[key] - previous[key];
  });
  return { thisWeek, previousWeek, current, previous, change };
}

export function bimonthly(modules, updates, startDate, endDate, config) {
  const range = { start: startDate, end: endDate };
  const before = updates.filter((u) => dayjs(u.date).isBefore(dayjs(startDate), "day"));
  const during = updates.filter((u) => inRange(u.date, range));
  const startKpis = overallKpis(modules, before, config);
  const endKpis = overallKpis(modules, [...before, ...during], config);
  return {
    range,
    startingAutomation: startKpis.totalAutomated,
    automationAdded: during.reduce((a, r) => a + dailyTotal(r), 0),
    endingAutomation: endKpis.totalAutomated,
    uiAdded: sumField(during, "uiAutomated"),
    apiAdded: sumField(during, "apiAutomated"),
    manualAdded: sumField(during, "manualWritten"),
    apisRecordedAdded: sumField(during, "apisRecorded"),
    defectsRaised: sumField(during, "defectsRaised"),
    defectsClosed: sumField(during, "defectsClosed"),
    startKpis,
    endKpis,
    trend: chartByDate(during),
  };
}

export function buildDashboard(db, filters = {}) {
  const config = { ...DEFAULT_CONFIG, ...db.config };
  const range = resolveRange(filters, db.sprints, config);
  const scoped = filterUpdates(db.dailyUpdates, filters, null);
  const ranged = filterUpdates(db.dailyUpdates, filters, range);
  const comparison = inSprintVsBacklog(scoped);
  const sprintRows = scoped.filter((u) => u.sprintId === config.currentSprintId);
  comparison.inSprint.sprint = sumField(sprintRows, "inSprintAutomated");
  comparison.backlog.sprint = sumField(sprintRows, "backlogAutomated");
  return {
    generatedAt: new Date().toISOString(),
    range,
    filters,
    config: {
      countingMode: config.countingMode,
      thresholds: config.thresholds,
      currentSprintId: config.currentSprintId,
      clientFocus: config.clientFocus,
      clientRisks: config.clientRisks,
      clientAchievements: config.clientAchievements,
    },
    kpis: overallKpis(db.modules, scoped, config),
    period: periodTotals(ranged),
    modules: db.modules.map((m) => moduleSnapshot(m, scoped, config)),
    dailyTrend: dailyTrend(ranged, db.users),
    chartByDate: chartByDate(ranged),
    inSprintVsBacklog: comparison,
    team: teamProgress(ranged, db.users),
    sprints: sprintProgress(db.sprints, scoped, config),
    currentSprint: db.sprints.find((s) => s.id === config.currentSprintId),
    achievements: scoped
      .filter((u) => u.comments)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8)
      .map((u) => ({
        date: u.date,
        comments: u.comments,
        qaName: db.users.find((user) => user.id === u.userId)?.name,
        moduleName: db.modules.find((m) => m.id === u.moduleId)?.name,
      })),
  };
}

export { DEFAULT_CONFIG, computeTotalAutomated };
