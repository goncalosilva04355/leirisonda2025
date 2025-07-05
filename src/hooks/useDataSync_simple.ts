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
  // CRITICAL FIX: Load data from localStorage on initialization
  const [works, setWorks] = useState<Work[]>(() => {
    try {
      const stored = localStorage.getItem("works");
      const parsedWorks = stored ? JSON.parse(stored) : [];
      console.log(
        "🔄 Loading works from localStorage:",
        parsedWorks.length,
        "works",
      );
      return parsedWorks;
    } catch (error) {
      console.error("❌ Error loading works from localStorage:", error);
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // CRITICAL FIX: Save to localStorage whenever works change
  useEffect(() => {
    try {
      localStorage.setItem("works", JSON.stringify(works));
      console.log("💾 Saved", works.length, "works to localStorage");
    } catch (error) {
      console.error("❌ Error saving works to localStorage:", error);
    }
  }, [works]);

  const addWork = useCallback((workData: Omit<Work, "id" | "createdAt">) => {
    const newWork: Work = {
      ...workData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setWorks((prev) => {
      const updated = [...prev, newWork];
      console.log(
        "✅ Work added:",
        newWork.title,
        "Total works:",
        updated.length,
      );
      return updated;
    });
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
