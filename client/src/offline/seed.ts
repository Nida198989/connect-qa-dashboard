import { DEFAULT_CONFIG } from "./analytics";

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
    ],
    modules: [],
    sprints: [],
    dailyUpdates: [],
    auditLogs: [],
    risks: [],
    config: { ...DEFAULT_CONFIG, currentSprintId: "", clientFocus: "", clientRisks: "", clientAchievements: "" },
  };
}
