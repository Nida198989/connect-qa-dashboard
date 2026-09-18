import type { DailyUpdate, DashboardData, Filters, User } from "../types";
import { bimonthly, buildDashboard, computeTotalAutomated, DEFAULT_CONFIG, moduleSnapshot, weeklyStatus } from "./analytics";
import { createSeed, WORK_TYPES } from "./seed";

const KEY = "connect-qa-offline-db-v4";
const SESSION = "connect-qa-offline-user";

function publicUser(user: any): User {
  return { id: user.id, name: user.name, email: user.email, role: user.role, active: user.active };
}

function load() {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  const seed = createSeed();
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}

function save(db: any) {
  localStorage.setItem(KEY, JSON.stringify(db));
  return db;
}

function currentUser() {
  const raw = localStorage.getItem(SESSION);
  return raw ? JSON.parse(raw) : null;
}

function enrich(row: any, db: any) {
  return {
    ...row,
    qaName: db.users.find((u: any) => u.id === row.userId)?.name,
    moduleName: db.modules.find((m: any) => m.id === row.moduleId)?.name,
    sprintName: db.sprints.find((s: any) => s.id === row.sprintId)?.sprintName,
    dailyTotal: Number(row.inSprintAutomated || 0) + Number(row.backlogAutomated || 0),
  };
}

function uniqueKey(row: any) {
  return [row.date, row.userId, row.moduleId, String(row.userStory || "").trim().toLowerCase()].join("|");
}

export const offline = {
  login(email: string, password: string) {
    const db = load();
    const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.active);
    if (!user) throw { response: { data: { message: "Invalid email or password." } } };
    localStorage.setItem(SESSION, JSON.stringify(publicUser(user)));
    return { token: "offline-token", user: publicUser(user) };
  },
  me() {
    const user = currentUser();
    if (!user) throw { response: { status: 401 } };
    return user;
  },
  getMeta() {
    const db = load();
    return {
      workTypes: WORK_TYPES,
      roles: ["qa", "lead", "admin"],
      users: db.users.filter((u: any) => u.active).map(publicUser),
      modules: db.modules,
      sprints: db.sprints,
      config: { ...DEFAULT_CONFIG, ...db.config },
    };
  },
  getDashboard(filters: Filters) {
    return buildDashboard(load(), filters) as DashboardData;
  },
  getWeekly(weekStart: string) {
    return weeklyStatus(load().dailyUpdates, weekStart);
  },
  getBimonthly(startDate: string, endDate: string) {
    const db = load();
    return bimonthly(db.modules, db.dailyUpdates, startDate, endDate, { ...DEFAULT_CONFIG, ...db.config });
  },
  getModuleDetail(id: string) {
    const db = load();
    const config = { ...DEFAULT_CONFIG, ...db.config };
    const mod = db.modules.find((m: any) => m.id === id);
    const rows = db.dailyUpdates.filter((u: any) => u.moduleId === id);
    const contributors = [...new Set(rows.map((r: any) => r.userId))].map((userId) => {
      const mine = rows.filter((r: any) => r.userId === userId);
      return {
        userId,
        name: db.users.find((u: any) => u.id === userId)?.name,
        totalAutomated: mine.reduce((a: number, r: any) => a + Number(r.inSprintAutomated || 0) + Number(r.backlogAutomated || 0), 0),
        uiAutomated: mine.reduce((a: number, r: any) => a + Number(r.uiAutomated || 0), 0),
        apiAutomated: mine.reduce((a: number, r: any) => a + Number(r.apiAutomated || 0), 0),
      };
    });
    const sprints: Record<string, any> = {};
    rows.forEach((r: any) => {
      if (!sprints[r.sprintId]) sprints[r.sprintId] = { sprintId: r.sprintId, sprintName: db.sprints.find((s: any) => s.id === r.sprintId)?.sprintName, inSprintAutomated: 0, backlogAutomated: 0, uiAutomated: 0, apiAutomated: 0 };
      sprints[r.sprintId].inSprintAutomated += Number(r.inSprintAutomated || 0);
      sprints[r.sprintId].backlogAutomated += Number(r.backlogAutomated || 0);
      sprints[r.sprintId].uiAutomated += Number(r.uiAutomated || 0);
      sprints[r.sprintId].apiAutomated += Number(r.apiAutomated || 0);
    });
    const trend: Record<string, any> = {};
    rows.forEach((r: any) => {
      if (!trend[r.date]) trend[r.date] = { date: r.date, uiAutomated: 0, apiAutomated: 0, inSprintAutomated: 0, backlogAutomated: 0 };
      trend[r.date].uiAutomated += Number(r.uiAutomated || 0);
      trend[r.date].apiAutomated += Number(r.apiAutomated || 0);
      trend[r.date].inSprintAutomated += Number(r.inSprintAutomated || 0);
      trend[r.date].backlogAutomated += Number(r.backlogAutomated || 0);
    });
    return { module: moduleSnapshot(mod, db.dailyUpdates, config), contributors, sprints: Object.values(sprints), trend: Object.values(trend), updates: rows };
  },
  listUpdates() {
    const db = load();
    const user = currentUser();
    let rows = db.dailyUpdates;
    if (user?.role === "qa") rows = rows.filter((r: any) => r.userId === user.id);
    return rows.map((row: any) => enrich(row, db));
  },
  lookupUpdate(params: Record<string, string>) {
    const db = load();
    const user = currentUser();
    const target = user?.role === "qa" ? user.id : params.userId;
    const found = db.dailyUpdates.find((row: any) => uniqueKey(row) === uniqueKey({ ...params, userId: target }));
    return found ? enrich(found, db) : null;
  },
  saveUpdate(payload: Partial<DailyUpdate>, filters: Filters) {
    const db = load();
    const user = currentUser();
    const next = { ...payload, userId: user?.role === "qa" ? user.id : payload.userId };
    if (!next.date || !next.userId || !next.moduleId || !next.sprintId || !next.workType || !String(next.userStory || "").trim()) {
      throw { response: { data: { message: "Date, QA name, module, sprint, user story, and work type are mandatory." } } };
    }
    const existing = db.dailyUpdates.find((row: any) => uniqueKey(row) === uniqueKey(next));
    const others = db.dailyUpdates.filter((row: any) => row.moduleId === next.moduleId && row.id !== existing?.id);
    const mod = db.modules.find((m: any) => m.id === next.moduleId);
    if (!mod) throw { response: { data: { message: "Module is required. Type a module name to add it." } } };
    const snapshot = moduleSnapshot(mod, others, db.config);
    const nextTotal = computeTotalAutomated(snapshot.current.uiAutomated + Number(next.uiAutomated || 0), snapshot.current.apiAutomated + Number(next.apiAutomated || 0), db.config.countingMode);
    if (Number(mod.totalTestCases) > 0 && !db.config.allowAutomationExceedScope && nextTotal > Number(mod.totalTestCases)) {
      throw { response: { data: { message: `Automated test cases cannot exceed Total TC (${mod.totalTestCases}) for ${mod.name}.` } } };
    }
    const now = new Date().toISOString();
    let saved;
    if (existing) {
      saved = { ...existing, ...next, updatedAt: now };
      db.dailyUpdates = db.dailyUpdates.map((row: any) => (row.id === existing.id ? saved : row));
    } else {
      saved = { id: `du-${Date.now()}`, ...next, createdAt: now, updatedAt: now };
      db.dailyUpdates.push(saved);
    }
    save(db);
    return { update: enrich(saved, db), dashboard: buildDashboard(db, filters), replaced: Boolean(existing) };
  },
  saveUser(payload: Partial<User> & { password?: string }, id?: string) {
    const db = load();
    if (!id) {
      const created = {
        id: `user-${Date.now()}`,
        name: payload.name,
        email: payload.email || `${String(payload.name).toLowerCase().replace(/[^a-z0-9]+/g, ".")}@connect.qa`,
        role: payload.role || "qa",
        active: payload.active ?? true,
        password: payload.password || "Connect@123",
      };
      db.users.push(created);
      save(db);
      return publicUser(created);
    }
    db.users = db.users.map((user: any) => (user.id === id ? { ...user, ...payload, name: String(payload.name || user.name).trim() } : user));
    save(db);
    return publicUser(db.users.find((u: any) => u.id === id));
  },
  resolveQaName(name: string) {
    const db = load();
    const trimmed = name.trim();
    const existing = db.users.find((u: any) => u.active && u.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return publicUser(existing);
    const user = currentUser();
    if (user?.role === "qa") return this.saveUser({ name: trimmed }, user.id);
    return this.saveUser({ name: trimmed, role: "qa" });
  },
  resolveModule(name: string) {
    const db = load();
    const existing = db.modules.find((m: any) => m.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) return existing;
    return this.saveModule({
      name: name.trim(),
      totalTestCases: 0,
      manualWritten: 0,
      uiAutomated: 0,
      apiRecorded: 0,
      apiAutomated: 0,
    });
  },
  resolveSprint(sprintName: string) {
    const db = load();
    const existing = db.sprints.find((s: any) => s.sprintName.toLowerCase() === sprintName.trim().toLowerCase());
    if (existing) return existing;
    const today = new Date().toISOString().slice(0, 10);
    const created = this.saveSprint({
      sprintName: sprintName.trim(),
      startDate: today,
      endDate: today,
      plannedTestCases: 0,
    });
    if (!db.config.currentSprintId) this.saveConfig({ currentSprintId: created.id });
    return created;
  },
  listUsers() {
    return load().users.map(publicUser);
  },
  saveModule(payload: Record<string, unknown>, id?: string) {
    const db = load();
    if (!id) {
      const created = { id: `mod-${Date.now()}`, baselineLocked: false, ...payload };
      db.modules.push(created);
      save(db);
      return created;
    }
    db.modules = db.modules.map((mod: any) => (mod.id === id ? { ...mod, ...payload } : mod));
    save(db);
    return db.modules.find((m: any) => m.id === id);
  },
  saveSprint(payload: Record<string, unknown>, id?: string) {
    const db = load();
    if (!id) {
      const created = { id: `sprint-${Date.now()}`, ...payload };
      db.sprints.push(created);
      save(db);
      return created;
    }
    db.sprints = db.sprints.map((sprint: any) => (sprint.id === id ? { ...sprint, ...payload } : sprint));
    save(db);
    return db.sprints.find((s: any) => s.id === id);
  },
  saveConfig(payload: Record<string, unknown>) {
    const db = load();
    db.config = { ...DEFAULT_CONFIG, ...db.config, ...payload };
    save(db);
    return db.config;
  },
  downloadExcel(filters: Filters) {
    const dash = buildDashboard(load(), filters);
    const rows = [["Metric", "Value"], ...Object.entries(dash.kpis), [], ["Module", "Total TC", "UI", "API", "Coverage"], ...dash.modules.map((m: any) => [m.name, m.current.totalTestCases, m.current.uiAutomated, m.current.apiAutomated, m.current.coverage])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "connect-qa-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  },
};

export function isOfflineMode() {
  return import.meta.env.VITE_OFFLINE === "true" || window.location.hostname.endsWith("github.io");
}
