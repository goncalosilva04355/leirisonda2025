#!/usr/bin/env node
// Script to batch update remaining utility files to use secure Firebase configuration

import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";

const files = [
  "src/utils/firestoreDebugger.ts",
  "src/utils/simpleFirestoreFix.ts",
  "src/utils/smartFirebaseTest.ts",
  "src/utils/forceFirestore.ts",
  "src/utils/definitiveFirestoreTest.ts",
  "src/utils/firebaseStatusCheck.ts",
  "src/utils/hybridStorage.ts",
  "src/utils/ultraSimpleFirestore.ts",
];

const API_KEY = "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw";

files.forEach((filePath) => {
  try {
    let content = readFileSync(filePath, "utf8");

    // Skip if file doesn't contain the API key
    if (!content.includes(API_KEY)) {
      console.log(`⏭️  Skipping ${filePath} - no hardcoded API key found`);
      return;
    }

    let modified = false;

    // Pattern 1: Firebase config object
    const configPattern =
      /const firebaseConfig = \{[^}]*apiKey: ["']AIzaSy[^"']*["'][^}]*\};/gs;
    if (configPattern.test(content)) {
      if (!content.includes("import { getUtilFirebaseConfig }")) {
        content = content.replace(
          /(import.*firebase.*;\n)/,
          "$1import { getUtilFirebaseConfig } from './firebaseConfigHelper';\n",
        );
      }
      content = content.replace(
        configPattern,
        "const firebaseConfig = getUtilFirebaseConfig();",
      );
      modified = true;
    }

    // Pattern 2: Direct API key assignment
    const directApiPattern = /const apiKey = ["']AIzaSy[^"']*["'];/g;
    if (directApiPattern.test(content)) {
      if (!content.includes("import { getRestApiConfig }")) {
        content = content.replace(
          /(\/\*\*[\s\S]*?\*\/\n|\/\/.*\n)*/,
          "$&import { getRestApiConfig } from './firebaseConfigHelper';\n\nconst config = getRestApiConfig();\n",
        );
      }
      content = content.replace(
        directApiPattern,
        "const apiKey = config.apiKey;",
      );
      modified = true;
    }

    // Pattern 3: Inline API key usage
    const inlinePattern = /["']AIzaSy[^"']*["']/g;
    if (inlinePattern.test(content) && !modified) {
      if (!content.includes("import { getRestApiConfig }")) {
        content = content.replace(
          /(\/\*\*[\s\S]*?\*\/\n|\/\/.*\n)*/,
          "$&import { getRestApiConfig } from './firebaseConfigHelper';\n\nconst config = getRestApiConfig();\n",
        );
      }
      content = content.replace(inlinePattern, "config.apiKey");
      modified = true;
    }

    if (modified) {
      writeFileSync(filePath, content, "utf8");
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(
        `⚠️  Could not automatically update ${filePath} - manual review needed`,
      );
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
});

console.log("\n✅ Batch update completed");
