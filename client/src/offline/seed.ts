import { DEFAULT_CONFIG } from "./analytics";

const modules = [
  ["Login", 20, 20, 20, 0, 0],
  ["Homepage", 57, 57, 57, 22, 22],
  ["User Management", 137, 137, 137, 34, 34],
  ["Supplier Management", 70, 40, 12, 0, 0],
  ["Supplier Sync", 21, 21, 21, 0, 0],
  ["Supplier Template Management", 114, 114, 112, 3, 3],
  ["Public Prospecting Page", 98, 98, 30, 0, 0],
  ["Private Prospecting Page", 63, 63, 0, 0, 0],
  ["Public Organization Search", 120, 100, 0, 0, 0],
  ["Private Organization Search", 66, 50, 0, 0, 0],
  ["Organization Details Page", 80, 20, 20, 0, 0],
  ["Branding Page", 15, 15, 0, 0, 0],
  ["Learning Page", 35, 25, 25, 0, 0],
  ["Help Module", 7, 7, 0, 0, 0],
  ["Active Profile Dropdown Modules", 60, 0, 0, 0, 0],
  ["Notification Module", 20, 0, 0, 0, 0],
  ["Supplier Impersonation", 50, 0, 0, 0, 0],
  ["Partner Development", 25, 0, 0, 0, 0],
] as const;

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function entry(id: string, partial: Record<string, unknown>) {
  const now = "2026-09-17T12:00:00.000Z";
  return {
    id,
    userStory: "US-CONNECT-000",
    workType: "In-Sprint Automation",
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

export const WORK_TYPES = [
  "In-Sprint Automation",
  "Backlog Automation",
  "Manual Test Design",
  "API Automation",
  "UI Automation",
  "API Recording",
  "Test Execution",
  "Defect Validation",
  "Other",
];

export function createSeed() {
  return {
    users: [
      { id: "user-admin", name: "System Admin", email: "admin@connect.qa", role: "admin", active: true, password: "Connect@123" },
      { id: "user-lead", name: "Nida Naaz", email: "nida.naaz@connect.qa", role: "lead", active: true, password: "Connect@123" },
      { id: "user-priya", name: "Priya Sharma", email: "priya.sharma@connect.qa", role: "qa", active: true, password: "Connect@123" },
      { id: "user-rahul", name: "Rahul Mehta", email: "rahul.mehta@connect.qa", role: "qa", active: true, password: "Connect@123" },
      { id: "user-ananya", name: "Ananya Iyer", email: "ananya.iyer@connect.qa", role: "qa", active: true, password: "Connect@123" },
      { id: "user-vikram", name: "Vikram Patel", email: "vikram.patel@connect.qa", role: "qa", active: true, password: "Connect@123" },
    ],
    modules: modules.map(([name, totalTestCases, manualWritten, uiAutomated, apiRecorded, apiAutomated]) => ({
      id: `mod-${slug(name)}`,
      name,
      totalTestCases,
      manualWritten,
      uiAutomated,
      apiRecorded,
      apiAutomated,
      baselineLocked: true,
    })),
    sprints: [
      { id: "sprint-17", sprintName: "Sprint 17", startDate: "2026-08-18", endDate: "2026-08-28", plannedTestCases: 80 },
      { id: "sprint-18", sprintName: "Sprint 18", startDate: "2026-09-01", endDate: "2026-09-11", plannedTestCases: 90 },
      { id: "sprint-19", sprintName: "Sprint 19", startDate: "2026-09-15", endDate: "2026-09-25", plannedTestCases: 85 },
    ],
    dailyUpdates: [
      entry("du-1", { date: "2026-09-01", userId: "user-priya", moduleId: "mod-supplier-management", sprintId: "sprint-18", userStory: "US-SM-214", workType: "UI Automation", inSprintAutomated: 3, backlogAutomated: 2, uiAutomated: 5, comments: "Automated supplier create/edit happy-path flows." }),
      entry("du-2", { date: "2026-09-01", userId: "user-rahul", moduleId: "mod-public-prospecting-page", sprintId: "sprint-18", userStory: "US-PP-118", workType: "Backlog Automation", inSprintAutomated: 2, backlogAutomated: 4, uiAutomated: 5, apiAutomated: 1, apisRecorded: 1, comments: "Closed public prospecting backlog filters." }),
      entry("du-3", { date: "2026-09-02", userId: "user-priya", moduleId: "mod-supplier-management", sprintId: "sprint-18", userStory: "US-SM-220", workType: "In-Sprint Automation", inSprintAutomated: 4, backlogAutomated: 1, uiAutomated: 4, comments: "Covered supplier status transitions." }),
      entry("du-4", { date: "2026-09-02", userId: "user-ananya", moduleId: "mod-public-organization-search", sprintId: "sprint-18", userStory: "US-OS-090", workType: "Manual Test Design", manualWritten: 8, testCasesExecuted: 6, passed: 5, failed: 1, defectsRaised: 1, highDefects: 1, comments: "Designed search facet cases." }),
      entry("du-5", { date: "2026-09-03", userId: "user-vikram", moduleId: "mod-organization-details-page", sprintId: "sprint-18", userStory: "US-OD-044", workType: "UI Automation", inSprintAutomated: 2, backlogAutomated: 3, uiAutomated: 5, comments: "Automated organization header and tabs." }),
      entry("du-6", { date: "2026-09-04", userId: "user-rahul", moduleId: "mod-private-prospecting-page", sprintId: "sprint-18", userStory: "US-PRP-010", workType: "UI Automation", inSprintAutomated: 3, backlogAutomated: 2, uiAutomated: 5, comments: "Started private prospecting UI pack." }),
      entry("du-7", { date: "2026-09-08", userId: "user-ananya", moduleId: "mod-branding-page", sprintId: "sprint-18", userStory: "US-BR-012", workType: "UI Automation", inSprintAutomated: 2, backlogAutomated: 2, uiAutomated: 4, comments: "Automated logo and theme cases." }),
      entry("du-8", { date: "2026-09-09", userId: "user-priya", moduleId: "mod-supplier-template-management", sprintId: "sprint-18", userStory: "US-STM-301", workType: "API Automation", inSprintAutomated: 1, apiAutomated: 2, apisRecorded: 2, comments: "Automated two remaining template APIs." }),
      entry("du-9", { date: "2026-09-10", userId: "user-vikram", moduleId: "mod-help-module", sprintId: "sprint-18", userStory: "US-HELP-003", workType: "UI Automation", inSprintAutomated: 2, backlogAutomated: 1, uiAutomated: 3, comments: "Automated help search." }),
      entry("du-10", { date: "2026-09-11", userId: "user-rahul", moduleId: "mod-public-organization-search", sprintId: "sprint-18", userStory: "US-OS-101", workType: "In-Sprint Automation", inSprintAutomated: 4, backlogAutomated: 2, uiAutomated: 6, comments: "First UI slice for public organization search." }),
      entry("du-11", { date: "2026-09-15", userId: "user-priya", moduleId: "mod-supplier-management", sprintId: "sprint-19", userStory: "US-SM-241", workType: "In-Sprint Automation", inSprintAutomated: 3, backlogAutomated: 2, uiAutomated: 4, apiAutomated: 1, apisRecorded: 2, comments: "Sprint 19 kickoff for supplier bulk-update." }),
      entry("du-12", { date: "2026-09-15", userId: "user-ananya", moduleId: "mod-private-organization-search", sprintId: "sprint-19", userStory: "US-POS-021", workType: "Manual Test Design", manualWritten: 6, testCasesExecuted: 8, passed: 6, failed: 1, blocked: 1, defectsRaised: 2, mediumDefects: 2, comments: "Wrote private search ACL cases." }),
      entry("du-13", { date: "2026-09-16", userId: "user-rahul", moduleId: "mod-public-prospecting-page", sprintId: "sprint-19", userStory: "US-PP-130", workType: "Backlog Automation", inSprintAutomated: 2, backlogAutomated: 5, uiAutomated: 6, comments: "Cleared public prospecting export backlog." }),
      entry("du-14", { date: "2026-09-16", userId: "user-vikram", moduleId: "mod-notification-module", sprintId: "sprint-19", userStory: "US-NT-001", workType: "Manual Test Design", manualWritten: 5, inSprintAutomated: 1, uiAutomated: 1, comments: "Started notification baseline." }),
      entry("du-15", { date: "2026-09-17", userId: "user-priya", moduleId: "mod-user-management", sprintId: "sprint-19", userStory: "US-UM-418", workType: "API Automation", inSprintAutomated: 3, backlogAutomated: 5, apiAutomated: 2, apisRecorded: 2, comments: "Automated User Management API cases." }),
      entry("du-16", { date: "2026-09-17", userId: "user-rahul", moduleId: "mod-private-prospecting-page", sprintId: "sprint-19", userStory: "US-PRP-022", workType: "UI Automation", inSprintAutomated: 4, backlogAutomated: 2, uiAutomated: 6, testCasesExecuted: 10, passed: 8, failed: 2, defectsRaised: 1, highDefects: 1, comments: "Private prospecting list automation." }),
      entry("du-17", { date: "2026-09-17", userId: "user-ananya", moduleId: "mod-public-organization-search", sprintId: "sprint-19", userStory: "US-OS-110", workType: "In-Sprint Automation", inSprintAutomated: 3, backlogAutomated: 1, uiAutomated: 4, comments: "Extended organization search coverage." }),
      entry("du-18", { date: "2026-08-20", userId: "user-priya", moduleId: "mod-learning-page", sprintId: "sprint-17", userStory: "US-LN-008", workType: "Backlog Automation", backlogAutomated: 3, uiAutomated: 3, comments: "Closed Learning Page backlog." }),
      entry("du-19", { date: "2026-08-21", userId: "user-rahul", moduleId: "mod-supplier-management", sprintId: "sprint-17", userStory: "US-SM-180", workType: "Manual Test Design", manualWritten: 6, comments: "Expanded supplier onboarding design." }),
    ],
    auditLogs: [],
    config: { ...DEFAULT_CONFIG },
  };
}
