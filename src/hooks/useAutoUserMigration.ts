import { useEffect, useState, useRef } from "react";

interface MigrationStatus {
  isRunning: boolean;
  completed: boolean;
  migrated: number;
  skipped: number;
  failed: number;
  lastAttempt: number;
  error?: string;
}

export const useAutoUserMigration = () => {
  const [status, setStatus] = useState<MigrationStatus>({
    isRunning: false,
    completed: false,
    migrated: 0,
    skipped: 0,
    failed: 0,
    lastAttempt: 0,
  });

  const migrationAttempted = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkAndMigrate = async () => {
    // Don't run multiple migrations simultaneously
    if (status.isRunning || migrationAttempted.current) {
      return;
    }

    try {
      console.log("🔍 AUTO-MIGRATION: Checking if user migration is needed...");

      const { MigrateUsersToFirestore } = await import(
        "../utils/migrateUsersToFirestore"
      );

      // Check if migration is needed
      const needsMigration = await MigrateUsersToFirestore.needsMigration();

      if (!needsMigration) {
        console.log("✅ AUTO-MIGRATION: No migration needed");
        setStatus((prev) => ({
          ...prev,
          completed: true,
          lastAttempt: Date.now(),
        }));
        return;
      }

      console.log(
        "🔄 AUTO-MIGRATION: Migration needed, starting automatic migration...",
      );
      migrationAttempted.current = true;

      setStatus((prev) => ({
        ...prev,
        isRunning: true,
        lastAttempt: Date.now(),
      }));

      // Perform migration
      const result = await MigrateUsersToFirestore.migrateAllUsers();

      if (result.success) {
        console.log(
          `✅ AUTO-MIGRATION: Success! Migrated ${result.migrated} users`,
        );
        console.log("🎉 Users now available across all devices and browsers!");

        setStatus({
          isRunning: false,
          completed: true,
          migrated: result.migrated,
          skipped: result.skipped,
          failed: result.failed,
          lastAttempt: Date.now(),
        });

        // Notify other systems that users have been migrated
        window.dispatchEvent(
          new CustomEvent("usersMigrated", {
            detail: result,
          }),
        );
      } else {
        console.warn("⚠️ AUTO-MIGRATION: Failed", result.details);
        setStatus((prev) => ({
          ...prev,
          isRunning: false,
          failed: result.failed,
          error: result.details.join(", "),
          lastAttempt: Date.now(),
        }));
      }
    } catch (error: any) {
      console.error("❌ AUTO-MIGRATION: Error during migration", error);
      setStatus((prev) => ({
        ...prev,
        isRunning: false,
        error: error.message,
        lastAttempt: Date.now(),
      }));
    }
  };

  // Start automatic migration check when hook is mounted
  useEffect(() => {
    console.log("🚀 AUTO-MIGRATION: System started");
    console.log(
      "🔄 AUTO-MIGRATION: Automatic user migration to Firestore enabled",
    );

    // Initial check after a short delay to let Firebase initialize
    const initialTimeout = setTimeout(() => {
      checkAndMigrate();
    }, 3000);

    // Then check periodically every 60 seconds until completed
    intervalRef.current = setInterval(() => {
      if (!status.completed && !status.isRunning) {
        checkAndMigrate();
      }
    }, 60000);

    // Listen for Firebase fix events to trigger immediate migration
    const handleFirebaseFixed = () => {
      console.log(
        "🔔 AUTO-MIGRATION: Firebase fixed event received, triggering migration...",
      );
      setTimeout(() => {
        checkAndMigrate();
      }, 1000);
    };

    window.addEventListener("firebaseFixed", handleFirebaseFixed);

    // Cleanup
    return () => {
      if (initialTimeout) {
        clearTimeout(initialTimeout);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("firebaseFixed", handleFirebaseFixed);
    };
  }, []);

  // Stop interval when migration is completed
  useEffect(() => {
    if (status.completed && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("✅ AUTO-MIGRATION: System completed, stopping checks");
    }
  }, [status.completed]);

  // Manual trigger for migration
  const triggerMigration = async () => {
    migrationAttempted.current = false; // Reset flag
    await checkAndMigrate();
  };

  return {
    status,
    triggerMigration,
    isActive: !!intervalRef.current,
  };
};
