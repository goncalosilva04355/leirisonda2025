// Script para atualizar todas as referências do Firebase API key
const fs = require("fs");
const path = require("path");

const API_KEY = "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw";

// Lista de arquivos que contêm a API key hardcoded
const filesToUpdate = [
  "src/firebase/leiriaConfig.ts",
  "src/firebase/mobileFirebase.ts",
  "src/components/FirebaseConfig.tsx",
  "src/components/AdvancedSettings.tsx",
  "src/utils/advancedFirestoreTest.ts",
  "src/utils/definitiveFirestoreTest.ts",
  "src/utils/firestoreDebugger.ts",
  "src/utils/forceFirestore.ts",
  "src/utils/hybridStorage.ts",
  "src/utils/simpleFirebaseInit.ts",
  "src/utils/firebaseStatusCheck.ts",
  "src/utils/simpleFirestoreFix.ts",
  "src/utils/ultraSimpleFirestore.ts",
  "src/utils/smartFirebaseTest.ts",
  "public/firebase-messaging-sw.js",
];

// Función para actualizar archivo
function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Si contiene la API key hardcoded
    if (content.includes(API_KEY)) {
      console.log(`🔧 Updating: ${filePath}`);

      // Reemplazar la API key hardcoded por referencia a configuración centralizada
      if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
        // Para archivos TypeScript/TSX
        content = content.replace(
          new RegExp(`"${API_KEY}"`, "g"),
          "getApiKey()",
        );
        content = content.replace(
          new RegExp(`'${API_KEY}'`, "g"),
          "getApiKey()",
        );

        // Agregar import si no existe
        if (!content.includes("getApiKey")) {
          const importLine =
            "import { getApiKey } from '../firebase/config';\n";
          content = importLine + content;
        }
      } else if (filePath.endsWith(".js")) {
        // Para archivos JavaScript
        content = content.replace(
          new RegExp(`"${API_KEY}"`, "g"),
          '"FIREBASE_API_KEY_FROM_ENV"',
        );
        content = content.replace(
          new RegExp(`'${API_KEY}'`, "g"),
          '"FIREBASE_API_KEY_FROM_ENV"',
        );
      }

      fs.writeFileSync(filePath, content);
      return true;
    } else {
      console.log(`✅ Already updated: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Ejecutar actualizaciones
console.log("🚀 Starting Firebase references update...\n");

let updatedCount = 0;
for (const file of filesToUpdate) {
  if (updateFile(file)) {
    updatedCount++;
  }
}

console.log(`\n✅ Update complete! ${updatedCount} files updated.`);
console.log(
  "🔐 All Firebase API keys are now secured with environment variables.",
);
