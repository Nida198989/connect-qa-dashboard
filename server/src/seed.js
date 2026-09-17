const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const { resetDb } = require("./db");
const { BASELINE_MODULES, DEFAULT_CONFIG, WORK_TYPES } = require("./constants");

const passwordHash = bcrypt.hashSync("Connect@123", 10);

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildUsers() {
  return [
    { id: "user-admin", name: "System Admin", email: "admin@connect.qa", role: "admin", active: true, passwordHash },
    { id: "user-lead", name: "Nida Naaz", email: "nida.naaz@connect.qa", role: "lead", active: true, passwordHash },
    { id: "user-priya", name: "Priya Sharma", email: "priya.sharma@connect.qa", role: "qa", active: true, passwordHash },
    { id: "user-rahul", name: "Rahul Mehta", email: "rahul.mehta@connect.qa", role: "qa", active: true, passwordHash },
    { id: "user-ananya", name: "Ananya Iyer", email: "ananya.iyer@connect.qa", role: "qa", active: true, passwordHash },
    { id: "user-vikram", name: "Vikram Patel", email: "vikram.patel@connect.qa", role: "qa", active: true, passwordHash },
  ];
}

function buildModules() {
  return BASELINE_MODULES.map((mod) => ({
    id: `mod-${slug(mod.name)}`,
    ...mod,
    baselineLocked: true,
  }));
}

function buildSprints() {
  return [
    { id: "sprint-17", sprintName: "Sprint 17", startDate: "2026-08-18", endDate: "2026-08-28", plannedTestCases: 80 },
    { id: "sprint-18", sprintName: "Sprint 18", startDate: "2026-09-01", endDate: "2026-09-11", plannedTestCases: 90 },
    { id: "sprint-19", sprintName: "Sprint 19", startDate: "2026-09-15", endDate: "2026-09-25", plannedTestCases: 85 },
  ];
}

function entry(partial) {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    userStory: "US-CONNECT-000",
    workType: WORK_TYPES[0],
    inSprintAutomated: 0,
    backlogAutomated: 0,
    uiAutomated: 0,
    apiAutomated: 0,
    manualWritten: 0,
    testCasesExecuted: 0,
    passed: 0,
    failed: 0,
    blocked: 0,
    apisRecorded: 0,
    defectsRaised: 0,
    criticalDefects: 0,
    highDefects: 0,
    mediumDefects: 0,
    lowDefects: 0,
    defectsClosed: 0,
    comments: "",
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

function buildSampleUpdates() {
  return [
    entry({
      date: "2026-09-01",
      userId: "user-priya",
      moduleId: "mod-supplier-management",
      sprintId: "sprint-18",
      userStory: "US-SM-214",
      workType: "UI Automation",
      inSprintAutomated: 3,
      backlogAutomated: 2,
      uiAutomated: 5,
      comments: "Automated supplier create/edit happy-path flows and two backlog regression cases.",
    }),
    entry({
      date: "2026-09-01",
      userId: "user-rahul",
      moduleId: "mod-public-prospecting-page",
      sprintId: "sprint-18",
      userStory: "US-PP-118",
      workType: "Backlog Automation",
      inSprintAutomated: 2,
      backlogAutomated: 4,
      uiAutomated: 5,
      apiAutomated: 1,
      apisRecorded: 1,
      comments: "Closed backlog filters for public prospecting and recorded one search API.",
    }),
    entry({
      date: "2026-09-02",
      userId: "user-priya",
      moduleId: "mod-supplier-management",
      sprintId: "sprint-18",
      userStory: "US-SM-220",
      workType: "In-Sprint Automation",
      inSprintAutomated: 4,
      backlogAutomated: 1,
      uiAutomated: 4,
      comments: "Covered supplier status transitions for Sprint 18.",
    }),
    entry({
      date: "2026-09-02",
      userId: "user-ananya",
      moduleId: "mod-public-organization-search",
      sprintId: "sprint-18",
      userStory: "US-OS-090",
      workType: "Manual Test Design",
      manualWritten: 8,
      testCasesExecuted: 6,
      passed: 5,
      failed: 1,
      defectsRaised: 1,
      highDefects: 1,
      comments: "Designed search facet cases and logged one high-severity filter defect.",
    }),
    entry({
      date: "2026-09-03",
      userId: "user-vikram",
      moduleId: "mod-organization-details-page",
      sprintId: "sprint-18",
      userStory: "US-OD-044",
      workType: "UI Automation",
      inSprintAutomated: 2,
      backlogAutomated: 3,
      uiAutomated: 5,
      comments: "Automated organization header, tabs, and related-entity widgets.",
    }),
    entry({
      date: "2026-09-04",
      userId: "user-rahul",
      moduleId: "mod-private-prospecting-page",
      sprintId: "sprint-18",
      userStory: "US-PRP-010",
      workType: "UI Automation",
      inSprintAutomated: 3,
      backlogAutomated: 2,
      uiAutomated: 5,
      comments: "Started first UI pack for private prospecting saved searches.",
    }),
    entry({
      date: "2026-09-08",
      userId: "user-ananya",
      moduleId: "mod-branding-page",
      sprintId: "sprint-18",
      userStory: "US-BR-012",
      workType: "UI Automation",
      inSprintAutomated: 2,
      backlogAutomated: 2,
      uiAutomated: 4,
      comments: "Automated logo and theme persistence cases.",
    }),
    entry({
      date: "2026-09-09",
      userId: "user-priya",
      moduleId: "mod-supplier-template-management",
      sprintId: "sprint-18",
      userStory: "US-STM-301",
      workType: "API Automation",
      inSprintAutomated: 1,
      apiAutomated: 2,
      apisRecorded: 2,
      comments: "Recorded and automated two remaining template APIs.",
    }),
    entry({
      date: "2026-09-10",
      userId: "user-vikram",
      moduleId: "mod-help-module",
      sprintId: "sprint-18",
      userStory: "US-HELP-003",
      workType: "UI Automation",
      inSprintAutomated: 2,
      backlogAutomated: 1,
      uiAutomated: 3,
      comments: "Automated help search and article navigation.",
    }),
    entry({
      date: "2026-09-11",
      userId: "user-rahul",
      moduleId: "mod-public-organization-search",
      sprintId: "sprint-18",
      userStory: "US-OS-101",
      workType: "In-Sprint Automation",
      inSprintAutomated: 4,
      backlogAutomated: 2,
      uiAutomated: 6,
      comments: "First UI automation slice for public organization search.",
    }),
    entry({
      date: "2026-09-15",
      userId: "user-priya",
      moduleId: "mod-supplier-management",
      sprintId: "sprint-19",
      userStory: "US-SM-241",
      workType: "In-Sprint Automation",
      inSprintAutomated: 3,
      backlogAutomated: 2,
      uiAutomated: 4,
      apiAutomated: 1,
      apisRecorded: 2,
      comments: "Sprint 19 kickoff: supplier bulk-update UI plus one sync API.",
    }),
    entry({
      date: "2026-09-15",
      userId: "user-ananya",
      moduleId: "mod-private-organization-search",
      sprintId: "sprint-19",
      userStory: "US-POS-021",
      workType: "Manual Test Design",
      manualWritten: 6,
      testCasesExecuted: 8,
      passed: 6,
      failed: 1,
      blocked: 1,
      defectsRaised: 2,
      mediumDefects: 2,
      comments: "Wrote private search ACL cases and validated two medium defects.",
    }),
    entry({
      date: "2026-09-16",
      userId: "user-rahul",
      moduleId: "mod-public-prospecting-page",
      sprintId: "sprint-19",
      userStory: "US-PP-130",
      workType: "Backlog Automation",
      inSprintAutomated: 2,
      backlogAutomated: 5,
      uiAutomated: 6,
      comments: "Cleared remaining public prospecting export backlog cases.",
    }),
    entry({
      date: "2026-09-16",
      userId: "user-vikram",
      moduleId: "mod-notification-module",
      sprintId: "sprint-19",
      userStory: "US-NT-001",
      workType: "Manual Test Design",
      manualWritten: 5,
      inSprintAutomated: 1,
      uiAutomated: 1,
      comments: "Started notification baseline design and first toast automation.",
    }),
    entry({
      date: "2026-09-17",
      userId: "user-priya",
      moduleId: "mod-user-management",
      sprintId: "sprint-19",
      userStory: "US-UM-418",
      workType: "API Automation",
      inSprintAutomated: 3,
      backlogAutomated: 5,
      uiAutomated: 0,
      apiAutomated: 2,
      apisRecorded: 2,
      comments: "Automated 8 backlog/in-sprint API cases for User Management and completed API validation for 3 endpoints.",
    }),
    entry({
      date: "2026-09-17",
      userId: "user-rahul",
      moduleId: "mod-private-prospecting-page",
      sprintId: "sprint-19",
      userStory: "US-PRP-022",
      workType: "UI Automation",
      inSprintAutomated: 4,
      backlogAutomated: 2,
      uiAutomated: 6,
      testCasesExecuted: 10,
      passed: 8,
      failed: 2,
      defectsRaised: 1,
      highDefects: 1,
      comments: "Private prospecting list + filter automation; one high defect on saved-search persistence.",
    }),
    entry({
      date: "2026-09-17",
      userId: "user-ananya",
      moduleId: "mod-public-organization-search",
      sprintId: "sprint-19",
      userStory: "US-OS-110",
      workType: "In-Sprint Automation",
      inSprintAutomated: 3,
      backlogAutomated: 1,
      uiAutomated: 4,
      comments: "Extended organization search coverage for column sort and pagination.",
    }),
    entry({
      date: "2026-08-20",
      userId: "user-priya",
      moduleId: "mod-learning-page",
      sprintId: "sprint-17",
      userStory: "US-LN-008",
      workType: "Backlog Automation",
      backlogAutomated: 3,
      uiAutomated: 3,
      comments: "Closed remaining Learning Page video-player backlog.",
    }),
    entry({
      date: "2026-08-21",
      userId: "user-rahul",
      moduleId: "mod-supplier-management",
      sprintId: "sprint-17",
      userStory: "US-SM-180",
      workType: "Manual Test Design",
      manualWritten: 6,
      comments: "Expanded supplier onboarding design coverage in Sprint 17.",
    }),
  ];
}

function seed() {
  const data = {
    users: buildUsers(),
    modules: buildModules(),
    sprints: buildSprints(),
    dailyUpdates: buildSampleUpdates(),
    auditLogs: [],
    config: { ...DEFAULT_CONFIG },
  };
  resetDb(data);
  return data;
}

if (require.main === module) {
  seed();
  console.log("Seeded Connect QA dashboard data.");
}

module.exports = { seed, buildUsers, buildModules, buildSprints };
