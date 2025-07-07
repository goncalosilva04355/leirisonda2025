// SISTEMA DE RECUPERAÇÃO DE EMERGÊNCIA CRÍTICA
export class EmergencyDataRecovery {
  // Dados mínimos SEM exemplos automáticos
  private static readonly MINIMAL_DATA = {
    works: [],
    pools: [],
    maintenance: [],
    clients: [],
  };

  // RECOVERY STEP 1: Scan all localStorage for any data
  static scanAllLocalStorage(): any {
    console.log("🔍 EMERGENCY SCAN: Scanning all localStorage...");

    const allData: any = {};
    const keys = Object.keys(localStorage);

    console.log(`📋 Found ${keys.length} localStorage keys:`, keys);

    keys.forEach((key) => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          // Try to parse as JSON
          try {
            const parsed = JSON.parse(value);
            allData[key] = parsed;
            console.log(
              `✅ ${key}:`,
              Array.isArray(parsed) ? `${parsed.length} items` : typeof parsed,
            );
          } catch {
            allData[key] = value; // Store as string if not JSON
            console.log(
              `📝 ${key}: ${value.substring(0, 50)}${value.length > 50 ? "..." : ""}`,
            );
          }
        }
      } catch (error) {
        console.warn(`⚠️ Error reading ${key}:`, error);
      }
    });

    return allData;
  }

  // RECOVERY STEP 2: Search for any backup data
  static findAnyBackupData(): any {
    console.log("🔍 EMERGENCY SEARCH: Looking for any backup data...");

    const allData = this.scanAllLocalStorage();
    const recoveredData: any = {
      works: [],
      pools: [],
      maintenance: [],
      clients: [],
    };

    // Search in all keys for backup data
    Object.keys(allData).forEach((key) => {
      const data = allData[key];

      // Look for direct data
      if (key === "works" && Array.isArray(data)) {
        recoveredData.works = data;
        console.log(`✅ Found works data: ${data.length} items`);
      }
      if (key === "pools" && Array.isArray(data)) {
        recoveredData.pools = data;
        console.log(`✅ Found pools data: ${data.length} items`);
      }
      if (key === "maintenance" && Array.isArray(data)) {
        recoveredData.maintenance = data;
        console.log(`✅ Found maintenance data: ${data.length} items`);
      }
      if (key === "clients" && Array.isArray(data)) {
        recoveredData.clients = data;
        console.log(`✅ Found clients data: ${data.length} items`);
      }

      // Look for backup data
      if (key.includes("backup") && typeof data === "object" && data !== null) {
        console.log(`🔍 Checking backup: ${key}`);
        if (data.works && Array.isArray(data.works) && data.works.length > 0) {
          recoveredData.works = [...recoveredData.works, ...data.works];
          console.log(
            `✅ Recovered works from ${key}: ${data.works.length} items`,
          );
        }
        if (data.pools && Array.isArray(data.pools) && data.pools.length > 0) {
          recoveredData.pools = [...recoveredData.pools, ...data.pools];
          console.log(
            `✅ Recovered pools from ${key}: ${data.pools.length} items`,
          );
        }
        if (
          data.maintenance &&
          Array.isArray(data.maintenance) &&
          data.maintenance.length > 0
        ) {
          recoveredData.maintenance = [
            ...recoveredData.maintenance,
            ...data.maintenance,
          ];
          console.log(
            `✅ Recovered maintenance from ${key}: ${data.maintenance.length} items`,
          );
        }
        if (
          data.clients &&
          Array.isArray(data.clients) &&
          data.clients.length > 0
        ) {
          recoveredData.clients = [...recoveredData.clients, ...data.clients];
          console.log(
            `✅ Recovered clients from ${key}: ${data.clients.length} items`,
          );
        }
      }

      // Look for daily/rolling backups
      if (key.includes("daily") || key.includes("rolling")) {
        if (Array.isArray(data) && data.length > 0) {
          const dataType = key.split("_")[0];
          if (["works", "pools", "maintenance", "clients"].includes(dataType)) {
            recoveredData[dataType] = [...recoveredData[dataType], ...data];
            console.log(
              `✅ Recovered ${dataType} from ${key}: ${data.length} items`,
            );
          }
        }
      }
    });

    // Remove duplicates
    ["works", "pools", "maintenance", "clients"].forEach((key) => {
      if (recoveredData[key].length > 0) {
        const seen = new Set();
        recoveredData[key] = recoveredData[key].filter((item: any) => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
        console.log(
          `🔧 Deduplicated ${key}: ${recoveredData[key].length} unique items`,
        );
      }
    });

    return recoveredData;
  }

  // RECOVERY STEP 3: Emergency restoration
  static executeEmergencyRecovery(): boolean {
    console.log("🚨 EXECUTING EMERGENCY RECOVERY...");

    try {
      // Step 1: Try to find any existing data
      const recoveredData = this.findAnyBackupData();

      // Step 2: Use recovered data or minimal data
      const finalData = {
        works:
          recoveredData.works.length > 0
            ? recoveredData.works
            : this.MINIMAL_DATA.works,
        pools:
          recoveredData.pools.length > 0
            ? recoveredData.pools
            : this.MINIMAL_DATA.pools,
        maintenance:
          recoveredData.maintenance.length > 0
            ? recoveredData.maintenance
            : this.MINIMAL_DATA.maintenance,
        clients:
          recoveredData.clients.length > 0
            ? recoveredData.clients
            : this.MINIMAL_DATA.clients,
      };

      // Step 3: Save to localStorage
      Object.keys(finalData).forEach((key) => {
        localStorage.setItem(
          key,
          JSON.stringify(finalData[key as keyof typeof finalData]),
        );
        console.log(
          `💾 Restored ${key}: ${finalData[key as keyof typeof finalData].length} items`,
        );
      });

      // Step 4: Create emergency backup
      const emergencyBackup = {
        timestamp: new Date().toISOString(),
        id: `emergency_recovery_${Date.now()}`,
        version: "1.0.0",
        source: "emergency_recovery",
        ...finalData,
      };

      localStorage.setItem(
        `backup_emergency_${emergencyBackup.id}`,
        JSON.stringify(emergencyBackup),
      );

      console.log("��� EMERGENCY RECOVERY COMPLETED");
      console.log("📊 Final counts:", {
        works: finalData.works.length,
        pools: finalData.pools.length,
        maintenance: finalData.maintenance.length,
        clients: finalData.clients.length,
      });

      return true;
    } catch (error) {
      console.error("❌ EMERGENCY RECOVERY FAILED:", error);

      // Last resort: Create minimal working structure
      try {
        console.log("🆘 LAST RESORT: Creating minimal working structure...");

        Object.keys(this.MINIMAL_DATA).forEach((key) => {
          localStorage.setItem(
            key,
            JSON.stringify(
              this.MINIMAL_DATA[key as keyof typeof this.MINIMAL_DATA],
            ),
          );
        });

        console.log("✅ MINIMAL STRUCTURE CREATED");
        return true;
      } catch (finalError) {
        console.error("❌ EVEN MINIMAL RECOVERY FAILED:", finalError);
        return false;
      }
    }
  }

  // RECOVERY STEP 4: Validate and report
  static validateRecovery(): { success: boolean; report: string } {
    try {
      const report = [];
      let success = true;

      ["works", "pools", "maintenance", "clients"].forEach((key) => {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "[]");
          if (Array.isArray(data)) {
            report.push(`✅ ${key}: ${data.length} items`);
          } else {
            report.push(`❌ ${key}: Invalid format`);
            success = false;
          }
        } catch (error) {
          report.push(`❌ ${key}: Error reading data`);
          success = false;
        }
      });

      return {
        success,
        report: report.join("\n"),
      };
    } catch (error) {
      return {
        success: false,
        report: `❌ Validation failed: ${error}`,
      };
    }
  }

  // MAIN RECOVERY FUNCTION
  static performCompleteRecovery(): { success: boolean; message: string } {
    console.log("🚨🚨🚨 CRITICAL DATA RECOVERY INITIATED 🚨🚨🚨");

    try {
      // Execute emergency recovery
      const recoverySuccess = this.executeEmergencyRecovery();

      if (!recoverySuccess) {
        return {
          success: false,
          message:
            "❌ Recovery failed completely. Manual intervention required.",
        };
      }

      // Validate recovery
      const validation = this.validateRecovery();

      return {
        success: validation.success,
        message: validation.success
          ? `✅ RECOVERY SUCCESSFUL!\n\n${validation.report}\n\n��� Please refresh the page.`
          : `⚠️ PARTIAL RECOVERY:\n\n${validation.report}\n\n🔄 Please refresh the page and check data.`,
      };
    } catch (error) {
      console.error("❌ COMPLETE RECOVERY FAILED:", error);
      return {
        success: false,
        message: `❌ Critical error during recovery: ${error}`,
      };
    }
  }
}

// Debug export disabled for production
