// SISTEMA DE INICIALIZAÇÃO FORÇADA - SEMPRE FUNCIONA
export class ForceInitialization {
  // Estrutura mínima SEM dados automáticos
  private static readonly REQUIRED_STRUCTURE = {
    works: [],
    pools: [],
    maintenance: [],
    clients: [],
  };

  // STEP 1: Verificação absoluta - existe ALGUMA coisa?
  static checkAbsoluteEmpty(): boolean {
    const keys = ["works", "pools", "maintenance", "clients"];

    for (const key of keys) {
      try {
        const data = localStorage.getItem(key);
        if (data && data !== "null" && data !== "undefined") {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            console.log(`✅ Found existing ${key}: ${parsed.length} items`);
            return false; // Não está completamente vazio
          }
        }
      } catch (error) {
        console.warn(`⚠️ Error checking ${key}:`, error);
      }
    }

    console.log("🚨 SYSTEM IS COMPLETELY EMPTY!");
    return true; // Está completamente vazio
  }

  // STEP 2: Força criação de estrutura mínima
  static forceCreateMinimalStructure(): void {
    console.log("🔧 FORCING MINIMAL STRUCTURE CREATION...");

    Object.entries(this.REQUIRED_STRUCTURE).forEach(([key, data]) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`✅ Created ${key}: ${data.length} items`);
      } catch (error) {
        console.error(`❌ Failed to create ${key}:`, error);

        // FALLBACK: Criar pelo menos array vazio
        try {
          localStorage.setItem(key, JSON.stringify([]));
          console.log(`🔧 Fallback: Created empty ${key} array`);
        } catch (fallbackError) {
          console.error(`❌ Even fallback failed for ${key}:`, fallbackError);
        }
      }
    });
  }

  // STEP 3: Verificação pós-criação
  static verifyStructure(): boolean {
    console.log("🔍 VERIFYING CREATED STRUCTURE...");

    const keys = ["works", "pools", "maintenance", "clients"];
    let allValid = true;

    for (const key of keys) {
      try {
        const data = localStorage.getItem(key);
        if (!data) {
          console.error(`❌ Missing ${key} in localStorage`);
          allValid = false;
          continue;
        }

        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) {
          console.error(`❌ ${key} is not an array:`, typeof parsed);
          allValid = false;
          continue;
        }

        console.log(`✅ ${key}: ${parsed.length} items, valid array`);
      } catch (error) {
        console.error(`❌ Error verifying ${key}:`, error);
        allValid = false;
      }
    }

    return allValid;
  }

  // STEP 4: Criação de backup inicial
  static createInitialBackup(): void {
    console.log("💾 CREATING INITIAL BACKUP...");

    try {
      const backupData: any = {
        timestamp: new Date().toISOString(),
        id: `force_init_${Date.now()}`,
        version: "1.0.0",
        source: "force_initialization",
        type: "initial_setup",
      };

      // Adicionar dados atuais ao backup
      ["works", "pools", "maintenance", "clients"].forEach((key) => {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "[]");
          backupData[key] = data;
        } catch (error) {
          backupData[key] = [];
        }
      });

      localStorage.setItem(
        `backup_emergency_${backupData.id}`,
        JSON.stringify(backupData),
      );
      console.log("✅ Initial backup created:", backupData.id);
    } catch (error) {
      console.error("❌ Failed to create initial backup:", error);
    }
  }

  // FUNÇÃO PRINCIPAL - Execute esta para garantir funcionamento
  static executeForceInitialization(): { success: boolean; message: string } {
    console.log("🚨🚨🚨 EXECUTING FORCE INITIALIZATION 🚨🚨🚨");

    try {
      // STEP 1: Verificar se sistema está vazio
      const isEmpty = this.checkAbsoluteEmpty();

      if (isEmpty) {
        console.log("🔧 System is empty, creating minimal structure...");

        // STEP 2: Criar estrutura mínima
        this.forceCreateMinimalStructure();

        // STEP 3: Verificar se funcionou
        const isValid = this.verifyStructure();

        if (!isValid) {
          return {
            success: false,
            message:
              "❌ Failed to create valid structure. Manual intervention required.",
          };
        }

        // STEP 4: Criar backup inicial
        this.createInitialBackup();

        return {
          success: true,
          message:
            "✅ SYSTEM INITIALIZED!\n\nMinimal working structure created.\nPage will reload automatically.",
        };
      } else {
        console.log("ℹ️ System has some data, checking integrity...");

        // Verificar se estrutura atual é válida
        const isValid = this.verifyStructure();

        if (!isValid) {
          console.log("🔧 Structure is invalid, forcing recreation...");
          this.forceCreateMinimalStructure();
          this.createInitialBackup();

          return {
            success: true,
            message:
              "✅ STRUCTURE REPAIRED!\n\nFixed invalid data structure.\nPage will reload automatically.",
          };
        }

        return {
          success: true,
          message: "✅ System structure is valid. No initialization needed.",
        };
      }
    } catch (error) {
      console.error("❌ FORCE INITIALIZATION FAILED:", error);

      // ÚLTIMO RECURSO: Criar arrays vazios
      try {
        console.log("🆘 LAST RESORT: Creating empty arrays...");
        ["works", "pools", "maintenance", "clients"].forEach((key) => {
          localStorage.setItem(key, JSON.stringify([]));
        });

        return {
          success: true,
          message:
            "⚠️ MINIMAL RECOVERY\n\nCreated empty data structures.\nSystem should work but will be empty.\nPage will reload automatically.",
        };
      } catch (lastResortError) {
        console.error("❌ EVEN LAST RESORT FAILED:", lastResortError);
        return {
          success: false,
          message:
            "❌ COMPLETE FAILURE\n\nUnable to initialize system.\nPlease clear localStorage and refresh page.",
        };
      }
    }
  }

  // Função de diagnóstico completo
  static diagnoseSystem(): string {
    console.log("🔍 SYSTEM DIAGNOSIS...");

    const report = [];
    report.push("=== SYSTEM DIAGNOSIS REPORT ===");
    report.push(`Timestamp: ${new Date().toISOString()}`);
    report.push("");

    // Verificar localStorage
    try {
      const keys = Object.keys(localStorage);
      report.push(`LocalStorage keys: ${keys.length}`);
      report.push(`Keys: ${keys.join(", ")}`);
      report.push("");
    } catch (error) {
      report.push(`LocalStorage error: ${error}`);
      report.push("");
    }

    // Verificar dados críticos
    ["works", "pools", "maintenance", "clients"].forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        if (!data) {
          report.push(`❌ ${key}: MISSING`);
        } else {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            report.push(`✅ ${key}: ${parsed.length} items`);
          } else {
            report.push(`⚠️ ${key}: Invalid format (${typeof parsed})`);
          }
        }
      } catch (error) {
        report.push(`❌ ${key}: Error - ${error}`);
      }
    });

    report.push("");
    report.push("=== END DIAGNOSIS ===");

    const reportText = report.join("\n");
    console.log(reportText);
    return reportText;
  }
}

// Debug export disabled for production

// Auto-execução desabilitada - dados criados manualmente pelo utilizador
// Sistema vazio é comportamento normal para aplicação limpa
