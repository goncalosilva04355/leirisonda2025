#!/usr/bin/env node
// Script to generate Service Worker with environment variables injected

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, "..");
const templatePath = join(
  projectRoot,
  "public",
  "firebase-messaging-sw-template.js",
);
const outputPath = join(projectRoot, "public", "firebase-messaging-sw.js");

// Read template
let template = readFileSync(templatePath, "utf8");

// Environment variables to inject
const envVars = {
  VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY || "",
  VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  VITE_FIREBASE_DATABASE_URL: process.env.VITE_FIREBASE_DATABASE_URL || "",
  VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID || "",
  VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  VITE_FIREBASE_MESSAGING_SENDER_ID:
    process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID || "",
  VITE_FIREBASE_MEASUREMENT_ID: process.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

// Check if environment variables are available
const missingVars = Object.entries(envVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(
    "❌ Missing required environment variables for Service Worker:",
  );
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error("\n💡 Set these environment variables before building.");
  process.exit(1);
}

// Replace placeholders with actual values
Object.entries(envVars).forEach(([key, value]) => {
  const placeholder = `{{${key}}}`;
  template = template.replaceAll(placeholder, value);
});

// Write output
writeFileSync(outputPath, template, "utf8");

console.log(
  "✅ Service Worker generated successfully with environment variables",
);
console.log(`📁 Output: ${outputPath}`);
console.log(`🔧 Project ID: ${envVars.VITE_FIREBASE_PROJECT_ID}`);
