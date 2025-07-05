import { useState, useCallback } from "react";

export interface Work {
  id: string;
  title: string;
  description: string;
  client: string;
  contact?: string;
  location: string;
  type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  startDate: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  assignedTo: string;
  assignedUsers?: Array<{ id: string; name: string }>;
  assignedUserIds?: string[];
  workSheetNumber?: string;
  startTime?: string;
  endTime?: string;
  observations: string;
  workPerformed: string;
  workSheetCompleted: boolean;
  createdAt: string;
}

export interface SyncState {
  works: Work[];
  isLoading: boolean;
  lastSync: Date | null;
  error: string | null;
}

export interface SyncActions {
  addWork: (work: Omit<Work, "id" | "createdAt">) => void;
  updateWork: (id: string, work: Partial<Work>) => void;
  deleteWork: (id: string) => void;
}

export function useDataSync(): SyncState & SyncActions {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addWork = useCallback((workData: Omit<Work, "id" | "createdAt">) => {
    const newWork: Work = {
      ...workData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setWorks((prev) => [...prev, newWork]);
    console.log("Work added:", newWork);
  }, []);

  const updateWork = useCallback((id: string, workData: Partial<Work>) => {
    setWorks((prev) =>
      prev.map((work) => (work.id === id ? { ...work, ...workData } : work)),
    );
  }, []);

  const deleteWork = useCallback((id: string) => {
    setWorks((prev) => prev.filter((work) => work.id !== id));
  }, []);

  return {
    works,
    isLoading,
    lastSync,
    error,
    addWork,
    updateWork,
    deleteWork,
  };
}
