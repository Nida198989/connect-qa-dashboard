const WORK_TYPES = [
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

const ROLES = ["qa", "lead", "admin"];

const DEFAULT_CONFIG = {
  countingMode: "unique_test_cases",
  allowAutomationExceedScope: false,
  allowApiExceedRecorded: false,
  thresholds: { green: 80, amber: 50, orange: 20 },
  currentSprintId: "sprint-19",
  clientFocus:
    "Complete remaining UI automation for Public/Private Prospecting and Organization Search, then expand API coverage for Supplier Management.",
  clientRisks:
    "Organization Search and Active Profile modules have limited automation; Supplier Impersonation and Notifications have no baseline coverage yet.",
  clientAchievements:
    "Login, Homepage, User Management, and Supplier Sync are fully UI automated. API coverage is complete for Homepage and User Management.",
};

const BASELINE_MODULES = [
  { name: "Login", totalTestCases: 20, manualWritten: 20, uiAutomated: 20, apiRecorded: 0, apiAutomated: 0 },
  { name: "Homepage", totalTestCases: 57, manualWritten: 57, uiAutomated: 57, apiRecorded: 22, apiAutomated: 22 },
  { name: "User Management", totalTestCases: 137, manualWritten: 137, uiAutomated: 137, apiRecorded: 34, apiAutomated: 34 },
  { name: "Supplier Management", totalTestCases: 70, manualWritten: 40, uiAutomated: 12, apiRecorded: 0, apiAutomated: 0 },
  { name: "Supplier Sync", totalTestCases: 21, manualWritten: 21, uiAutomated: 21, apiRecorded: 0, apiAutomated: 0 },
  { name: "Supplier Template Management", totalTestCases: 114, manualWritten: 114, uiAutomated: 112, apiRecorded: 3, apiAutomated: 3 },
  { name: "Public Prospecting Page", totalTestCases: 98, manualWritten: 98, uiAutomated: 30, apiRecorded: 0, apiAutomated: 0 },
  { name: "Private Prospecting Page", totalTestCases: 63, manualWritten: 63, uiAutomated: 0, apiRecorded: 0, apiAutomated: 0 },
  { name: "Public Organization Search", totalTestCases: 120, manualWritten: 100, uiAutomated: 0, apiRecorded: 0, apiAutomated: 0 },
  { name: "Private Organization Search", totalTestCases: 66, manualWritten: 50, uiAutomated: 0, apiRecorded: 0, apiAutomated: 0 },
  { name: "Organization Details Page", totalTestCases: 80, manualWritten: 20, uiAutomated: 20, apiRecorded: 0, apiAutomated: 0 },
  { name: "Branding Page", totalTestCases: 15, manualWritten: 15, uiAutomated: 0, apiRecorded: 0, apiAutomated: 0 },
  { name: "Learning Page", totalTestCases: 35, manualWritten: 25, uiAutomated: 25, apiRecorded: 0, apiAutomated: 0 },
  { name: "Help Module", totalTestCases: 7, manualWritten: 7, uiAutomated: 0, apiRecorded: 0, apiAutomated: 0 },
  { name: "Active Profile Dropdown Modules", totalTestCases: 60, manualWritten: 0, uiAutomated: 0, apiRecorded: 0, apiAutomated: 0 },
  { name: "Notification Module", totalTestCases: 20, manualWritten: 0, uiAutomated: 0, apiRecorded: 0, apiAutomated: 0 },
  { name: "Supplier Impersonation", totalTestCases: 50, manualWritten: 0, uiAutomated: 0, apiRecorded: 0, apiAutomated: 0 },
  { name: "Partner Development", totalTestCases: 25, manualWritten: 0, uiAutomated: 0, apiRecorded: 0, apiAutomated: 0 },
];

const NUMERIC_FIELDS = [
  "inSprintAutomated",
  "backlogAutomated",
  "uiAutomated",
  "apiAutomated",
  "manualWritten",
  "testCasesExecuted",
  "passed",
  "failed",
  "blocked",
  "apisRecorded",
  "defectsRaised",
  "criticalDefects",
  "highDefects",
  "mediumDefects",
  "lowDefects",
  "defectsClosed",
];

module.exports = {
  WORK_TYPES,
  ROLES,
  DEFAULT_CONFIG,
  BASELINE_MODULES,
  NUMERIC_FIELDS,
};
