import { Navigate, Route, Routes } from "react-router-dom";
import { CircularProgress, Stack } from "@mui/material";
import { useAuth } from "./auth";
import { AppStateProvider } from "./appState";
import { AppShell } from "./layout/AppShell";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectDashboardPage } from "./pages/ProjectDashboardPage";
import { DailyUpdatePage } from "./pages/DailyUpdatePage";
import { ModuleProgressPage } from "./pages/ModuleProgressPage";
import { SprintProgressPage } from "./pages/SprintProgressPage";
import { TeamProgressPage } from "./pages/TeamProgressPage";
import { ApiAutomationPage } from "./pages/ApiAutomationPage";
import { UiAutomationPage } from "./pages/UiAutomationPage";
import { ReportsPage } from "./pages/ReportsPage";
import { ClientViewPage } from "./pages/ClientViewPage";
import { AdminPage } from "./pages/AdminPage";
import { AutomationPage } from "./pages/AutomationPage";
import { ExecutionPage } from "./pages/ExecutionPage";
import { DefectsPage } from "./pages/DefectsPage";
import { RisksPage } from "./pages/RisksPage";
import { TrendsPage } from "./pages/TrendsPage";

function Guard({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "70vh" }}>
        <CircularProgress />
      </Stack>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "100vh" }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <Guard>
            <AppStateProvider>
              <AppShell />
            </AppStateProvider>
          </Guard>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="connect" element={<ProjectDashboardPage project="Connect" />} />
        <Route path="force" element={<ProjectDashboardPage project="Force" />} />
        <Route path="daily" element={<DailyUpdatePage />} />
        <Route path="automation" element={<AutomationPage />} />
        <Route path="execution" element={<ExecutionPage />} />
        <Route path="defects" element={<DefectsPage />} />
        <Route path="risks" element={<RisksPage />} />
        <Route path="trends" element={<TrendsPage />} />
        <Route path="modules" element={<ModuleProgressPage />} />
        <Route path="sprints" element={<SprintProgressPage />} />
        <Route path="team" element={<TeamProgressPage />} />
        <Route path="api-automation" element={<ApiAutomationPage />} />
        <Route path="ui-automation" element={<UiAutomationPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="client" element={<ClientViewPage />} />
        <Route path="admin" element={<Guard roles={["lead", "admin"]}><AdminPage /></Guard>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
