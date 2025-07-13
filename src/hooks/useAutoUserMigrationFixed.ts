import { useEffect, useState, useRef, useCallback } from "react";
import { LocalUserMigration } from "../utils/localUserMigration";

interface MigrationStatus {
  isRunning: boolean;
  completed: boolean;
  migrated: number;
  skipped: number;
  failed: number;
  lastAttempt: number;
  error?: string;
}

export const useAutoUserMigrationFixed = () => {
  // Initialize state with factory function for safer initialization
  const [status, setStatus] = useState<MigrationStatus>(() => ({
    isRunning: false,
    completed: false,
    migrated: 0,
    skipped: 0,
    failed: 0,
    lastAttempt: 0,
  }));

  const migrationAttempted = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkAndMigrate = useCallback(async () => {
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

      if (result.success && result.migrated > 0) {
        console.log(
          `✅ AUTO-MIGRATION: Firestore success! Migrated ${result.migrated} users`,
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
        // Check if this is specifically a Firestore not enabled issue
        const isFirestoreNotEnabled = result.details.some(
          (detail) =>
            detail.includes("FIRESTORE_NOT_ENABLED") ||
            detail.includes("Service firestore is not available") ||
            detail.includes("Firestore service not available") ||
            detail.includes("Firestore service not enabled"),
        );

        if (isFirestoreNotEnabled) {
          console.log(
            "🔥 AUTO-MIGRATION: Firestore service not enabled detected immediately - using local-only migration",
          );
          console.log(
            "📱 AUTO-MIGRATION: This avoids individual user migration failures",
          );
        } else {
          console.warn(
            "⚠️ AUTO-MIGRATION: Firestore migration failed for other reasons, trying local fallback...",
          );
        }

        // Try local migration as fallback
        try {
          const { LocalUserMigration } = await import(
            "../utils/localUserMigration"
          );
          const localResult = await LocalUserMigration.migrateLocalUsers();

          if (localResult.success) {
            if (isFirestoreNotEnabled) {
              console.log(
                `✅ AUTO-MIGRATION: Local-only migration successful! Synchronized ${localResult.migrated + localResult.synchronized} users`,
              );
              console.log(
                "📱 Users work on this device only (Firestore not enabled in Firebase project)",
              );
              console.log(
                "💡 To enable cross-device access, activate Firestore in Firebase Console",
              );
            } else {
              console.log(
                `✅ AUTO-MIGRATION: Local fallback success! Migrated ${localResult.migrated} users locally`,
              );
              console.log(
                "⚠️ Users work on this device only (Firestore connectivity issues)",
              );
            }

            setStatus({
              isRunning: false,
              completed: true,
              migrated: localResult.migrated,
              skipped: localResult.synchronized,
              failed: 0,
              lastAttempt: Date.now(),
              error: isFirestoreNotEnabled
                ? "Local-only mode (Firestore not enabled)"
                : "Local fallback (Firestore connectivity issues)",
            });

            // Notify that local migration completed
            window.dispatchEvent(
              new CustomEvent("usersLocallyMigrated", {
                detail: localResult,
              }),
            );
          } else {
            console.error(
              "❌ AUTO-MIGRATION: Both Firestore and local migration failed",
            );
            setStatus((prev) => ({
              ...prev,
              isRunning: false,
              failed: result.failed,
              error: `Firestore: ${result.details.join(", ")}. Local: ${localResult.details.join(", ")}`,
              lastAttempt: Date.now(),
            }));
          }
        } catch (localError: any) {
          console.error(
            "❌ AUTO-MIGRATION: Local fallback failed:",
            localError,
          );
          setStatus((prev) => ({
            ...prev,
            isRunning: false,
            failed: result.failed,
            error:
              result.details.join(", ") +
              `. Local fallback error: ${localError.message}`,
            lastAttempt: Date.now(),
          }));
        }
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
  }, [status.isRunning]);

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
  }, [checkAndMigrate]);

  // Stop interval when migration is completed
  useEffect(() => {
    if (status.completed && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("✅ AUTO-MIGRATION: System completed, stopping checks");
    }
  }, [status.completed]);

  // Manual trigger for migration
  const triggerMigration = useCallback(async () => {
    try {
      migrationAttempted.current = false; // Reset flag
      await checkAndMigrate();
    } catch (error) {
      console.error("❌ Error in triggerMigration:", error);
    }
  }, [checkAndMigrate]);

  return {
    status,
    triggerMigration,
    isActive: !!intervalRef.current,
  };
};
