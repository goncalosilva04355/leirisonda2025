import { useState, useEffect } from "react";

// Minimal working hook for debugging
export function useSimpleData() {
  const [data, setData] = useState({
    users: [],
    pools: [],
    maintenance: [],
    futureMaintenance: [],
    works: [],
    clients: [],
    isLoading: false,
    error: null,
  });

  // Mock services that do nothing but don't crash
  const mockService = {
    addPool: () => Promise.resolve("mock-id"),
    addWork: () => Promise.resolve("mock-id"),
    addMaintenance: () => Promise.resolve("mock-id"),
    addClient: () => Promise.resolve("mock-id"),
    updatePool: () => Promise.resolve(),
    updateWork: () => Promise.resolve(),
    updateMaintenance: () => Promise.resolve(),
    updateClient: () => Promise.resolve(),
    deletePool: () => Promise.resolve(),
    deleteWork: () => Promise.resolve(),
    deleteMaintenance: () => Promise.resolve(),
    deleteClient: () => Promise.resolve(),
  };

  console.log("✅ useSimpleData hook loaded successfully");

  return {
    ...data,
    userService: mockService,
    poolService: mockService,
    maintenanceService: mockService,
    workService: mockService,
    clientService: mockService,
  };
}
