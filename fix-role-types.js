const fs = require("fs");

const filesToFix = [
  "src/services/firebaseOnlyAuth.ts",
  "src/services/simpleAuthService.ts",
  "src/utils/userSyncManager.ts",
  "src/utils/localUserMigration.ts",
  "src/utils/migrateUsersToFirestore.ts",
  "src/config/authorizedUsers.ts",
];

const fixes = [
  {
    pattern: /role: "super_admin" \| "manager" \| "technician"/g,
    replacement: 'role: "super_admin" | "admin" | "manager" | "technician"',
  },
  {
    pattern: /role: "user" \| "admin" \| "super_admin"/g,
    replacement: 'role: "super_admin" | "admin" | "manager" | "technician"',
  },
];

console.log("Corrigindo tipos de role...");

filesToFix.forEach((filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf8");
      let modified = false;

      fixes.forEach((fix) => {
        if (fix.pattern.test(content)) {
          content = content.replace(fix.pattern, fix.replacement);
          modified = true;
        }
      });

      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ ${filePath} corrigido`);
      } else {
        console.log(`⚪ ${filePath} não precisava de correção`);
      }
    } else {
      console.log(`⚠️ ${filePath} não encontrado`);
    }
  } catch (error) {
    console.error(`❌ Erro ao corrigir ${filePath}:`, error.message);
  }
});

console.log("Correção de tipos concluída!");
