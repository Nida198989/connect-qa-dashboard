import axios from "axios";
import type { DashboardData, DailyUpdate, Filters, User } from "../types";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("qa-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  return data as { token: string; user: User };
}

export async function me() {
  const { data } = await api.get("/auth/me");
  return data.user as User;
}

export async function getMeta() {
  const { data } = await api.get("/meta");
  return data;
}

export function filterParams(filters: Filters) {
  const params: Record<string, string> = { preset: filters.preset };
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.userId) params.userId = filters.userId;
  if (filters.moduleId) params.moduleId = filters.moduleId;
  if (filters.sprintId) params.sprintId = filters.sprintId;
  if (filters.automationType) params.automationType = filters.automationType;
  return params;
}

export async function getDashboard(filters: Filters) {
  const { data } = await api.get("/dashboard", { params: filterParams(filters) });
  return data as DashboardData;
}

export async function getWeekly(weekStart: string) {
  const { data } = await api.get("/reports/weekly", { params: { weekStart } });
  return data;
}

export async function getBimonthly(startDate: string, endDate: string) {
  const { data } = await api.get("/reports/bimonthly", { params: { startDate, endDate } });
  return data;
}

export async function getModuleDetail(id: string) {
  const { data } = await api.get(`/modules/${id}/detail`);
  return data;
}

export async function listUpdates(params?: Record<string, string>) {
  const { data } = await api.get("/daily-updates", { params });
  return data as DailyUpdate[];
}

export async function lookupUpdate(params: Record<string, string>) {
  const { data } = await api.get("/daily-updates/lookup", { params });
  return data.existing as DailyUpdate | null;
}

export async function saveUpdate(payload: Partial<DailyUpdate>, filters: Filters) {
  const { data } = await api.post("/daily-updates", payload, { params: filterParams(filters) });
  return data as { update: DailyUpdate; dashboard: DashboardData; replaced: boolean };
}

export async function deleteUpdate(id: string) {
  await api.delete(`/daily-updates/${id}`);
}

export async function saveUser(payload: Partial<User> & { password?: string }, id?: string) {
  const { data } = id ? await api.put(`/users/${id}`, payload) : await api.post("/users", payload);
  return data as User;
}

export async function resolveQaName(name: string) {
  const { data } = await api.post("/users/resolve", { name });
  return data as User;
}

export async function listUsers() {
  const { data } = await api.get("/users");
  return data as User[];
}

export async function saveModule(payload: Record<string, unknown>, id?: string) {
  const { data } = id ? await api.put(`/modules/${id}`, payload) : await api.post("/modules", payload);
  return data;
}

export async function saveSprint(payload: Record<string, unknown>, id?: string) {
  const { data } = id ? await api.put(`/sprints/${id}`, payload) : await api.post("/sprints", payload);
  return data;
}

export async function saveConfig(payload: Record<string, unknown>) {
  const { data } = await api.put("/config", payload);
  return data;
}

export async function downloadExcel(filters: Filters) {
  const { data } = await api.get("/export/excel", {
    params: filterParams(filters),
    responseType: "blob",
  });
  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = "connect-qa-report.xlsx";
  link.click();
  URL.revokeObjectURL(url);
}

export default api;
