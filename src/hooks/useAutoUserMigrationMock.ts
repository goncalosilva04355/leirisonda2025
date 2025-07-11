// Mock simples para useAutoUserMigration
export const useAutoUserMigration = () => {
  console.log("👥 useAutoUserMigration - modo mock");

  return {
    status: {
      completed: false,
      migrated: 0,
      errors: [],
      inProgress: false,
    },
    startMigration: () => Promise.resolve(),
    resetMigration: () => {},
    migrationHistory: [],
  };
};

export default useAutoUserMigration;
