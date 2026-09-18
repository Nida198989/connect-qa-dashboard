import { useEffect } from "react";
import { useApp } from "../appState";
import type { ProjectName } from "../types";

export function useLockedProject(project: ProjectName | "") {
  const { filters, setFilters } = useApp();
  useEffect(() => {
    if ((filters.project || "") !== project) {
      setFilters({ ...filters, project, moduleId: "", sprintId: "" });
    }
  }, [project]);
}
