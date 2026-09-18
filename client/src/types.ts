export type Role = "qa" | "lead" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface Module {
  id: string;
  name: string;
  totalTestCases: number;
  manualWritten: number;
  uiAutomated: number;
  apiRecorded: number;
  apiAutomated: number;
  baselineLocked?: boolean;
  current?: ModuleCurrent;
}

export interface StatusTone {
  label: string;
  tone: "green" | "amber" | "orange" | "red";
}

export interface ModuleCurrent {
  totalTestCases: number;
  manualWritten: number;
  uiAutomated: number;
  apiAutomated: number;
  apiRecorded: number;
  inSprintAutomated: number;
  backlogAutomated: number;
  totalAutomated: number;
  remaining: number;
  coverage: number;
  status: StatusTone;
}

export interface Sprint {
  id: string;
  sprintName: string;
  startDate: string;
  endDate: string;
  plannedTestCases: number;
  inSprintAutoExecuted?: number;
  inSprintAutoPassed?: number;
  inSprintAutoFailed?: number;
  inSprintAutoBlocked?: number;
  inSprintExecutionNotes?: string;
  inSprintExecutionRecordedAt?: string;
  inSprintExecutionPassPct?: number;
  sprintClosed?: boolean;
  inSprintAutomated?: number;
  backlogAutomated?: number;
  uiAutomated?: number;
  apiAutomated?: number;
  totalAutomated?: number;
  manualWritten?: number;
  testCasesExecuted?: number;
  defectsRaised?: number;
  defectsClosed?: number;
  remaining?: number;
  completion?: number;
  manualPct?: number;
  executionPct?: number;
  status?: StatusTone;
}

export interface AppConfig {
  countingMode: "unique_test_cases" | "separate_assets" | "unique_max";
  allowAutomationExceedScope: boolean;
  allowApiExceedRecorded: boolean;
  thresholds: { green: number; amber: number; orange: number };
  currentSprintId: string;
  clientFocus: string;
  clientRisks: string;
  clientAchievements: string;
}

export interface DailyUpdate {
  id: string;
  date: string;
  userId: string;
  moduleId: string;
  sprintId: string;
  userStory: string;
  workType: string;
  inSprintAutomated: number;
  backlogAutomated: number;
  uiAutomated: number;
  apiAutomated: number;
  manualWritten: number;
  testCasesExecuted: number;
  passed: number;
  failed: number;
  blocked: number;
  apisRecorded: number;
  defectsRaised: number;
  criticalDefects: number;
  highDefects: number;
  mediumDefects: number;
  lowDefects: number;
  defectsClosed: number;
  comments: string;
  createdAt: string;
  updatedAt: string;
  qaName?: string;
  moduleName?: string;
  sprintName?: string;
  dailyTotal?: number;
}

export interface DashboardData {
  generatedAt: string;
  range: { start: string; end: string; label: string };
  config: AppConfig;
  kpis: {
    totalTestCases: number;
    manualWritten: number;
    uiAutomated: number;
    apiAutomated: number;
    totalAutomated: number;
    automationCoverage: number;
    apiRecorded: number;
    apiCoverage: number;
    inSprintAutomated: number;
    backlogAutomated: number;
    remaining: number;
    countingMode: string;
  };
  period: Record<string, number>;
  modules: Module[];
  dailyTrend: Array<{
    date: string;
    userId: string;
    qaName: string;
    inSprintAutomated: number;
    backlogAutomated: number;
    uiAutomated: number;
    apiAutomated: number;
    totalAutomated: number;
  }>;
  chartByDate: Array<{
    date: string;
    inSprintAutomated: number;
    backlogAutomated: number;
    uiAutomated: number;
    apiAutomated: number;
    totalAutomated: number;
  }>;
  inSprintVsBacklog: {
    inSprint: { today: number; week: number; sprint: number; cumulative: number };
    backlog: { today: number; week: number; sprint: number; cumulative: number };
  };
  team: Array<{
    userId: string;
    name: string;
    role: string;
    inSprintAutomated: number;
    backlogAutomated: number;
    uiAutomated: number;
    apiAutomated: number;
    totalAutomated: number;
    manualWritten: number;
    dailyAverage: number;
    daysLogged: number;
  }>;
  sprints: Sprint[];
  currentSprint?: Sprint;
  achievements: Array<{ date: string; comments: string; qaName?: string; moduleName?: string }>;
}

export interface Filters {
  preset: string;
  startDate: string;
  endDate: string;
  userId: string;
  moduleId: string;
  sprintId: string;
  automationType: string;
}

export const emptyDailyUpdate = (): Omit<DailyUpdate, "id" | "createdAt" | "updatedAt"> => ({
  date: "",
  userId: "",
  moduleId: "",
  sprintId: "",
  userStory: "",
  workType: "",
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
});
