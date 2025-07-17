#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Read the current build info
const buildInfo = {
  timestamp: new Date().toISOString(),
  commit: "local-build",
  version: "1.0.0",
  features: [
    "Complete pool management system",
    "Photo upload and gallery",
    "Professional reports with PDF",
    "Auto-sync data system",
    "Leirisonda branding integration",
    "Responsive design",
    "Mobile-optimized UI",
  ],
};

// Read existing manifest to maintain consistency
const manifestPath = path.join(__dirname, "manifest.json");
let deployManifest;

try {
  if (fs.existsSync(manifestPath)) {
    deployManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    deployManifest.build_info = buildInfo;
  } else {
    // Fallback manifest
    deployManifest = {
      name: "Leirisonda Obras",
      short_name: "Leirisonda",
      description: "Gestão de obras e manutenção de piscinas",
      start_url: "/",
      display: "standalone",
      background_color: "#1E40AF",
      theme_color: "#1E40AF",
      orientation: "any",
      scope: "/",
      build_info: buildInfo,
      icons: [
        {
          src: "/icon.svg",
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any",
        },
        {
          src: "/icon.svg",
          sizes: "192x192",
          type: "image/svg+xml",
          purpose: "any",
        },
        {
          src: "/icon.svg",
          sizes: "512x512",
          type: "image/svg+xml",
          purpose: "maskable",
        },
      ],
      categories: ["business", "productivity"],
      lang: "pt-PT",
      prefer_related_applications: false,
    };
  }
} catch (error) {
  console.warn("⚠️ Could not read existing manifest, using fallback");
  deployManifest = {
    name: "Leirisonda Obras",
    short_name: "Leirisonda",
    description: "Gestão de obras e manutenção de piscinas",
    start_url: "/",
    display: "standalone",
    background_color: "#1E40AF",
    theme_color: "#1E40AF",
    orientation: "any",
    scope: "/",
    build_info: buildInfo,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}

// Write deployment files
try {
  // Update manifest in dist
  const distManifestPath = path.join(__dirname, "dist", "spa", "manifest.json");
  if (fs.existsSync(distManifestPath)) {
    fs.writeFileSync(distManifestPath, JSON.stringify(deployManifest, null, 2));
    console.log("✅ Updated dist/spa/manifest.json");
  }

  // Don't overwrite public manifest to avoid build conflicts
  console.log(
    "⏸️ Skipping public/manifest.json update to avoid build conflicts",
  );

  // Create deployment trigger file
  const triggerPath = path.join(__dirname, ".deploy-trigger");
  fs.writeFileSync(
    triggerPath,
    JSON.stringify(
      {
        triggered_at: new Date().toISOString(),
        source: "automated",
        build_info: buildInfo,
      },
      null,
      2,
    ),
  );

  console.log("🚀 Deploy trigger created successfully!");
  console.log("📦 Build ready for automatic deployment");
  console.log("🔄 GitHub Actions will deploy to Netlify automatically");

  return true;
} catch (error) {
  console.error("❌ Error creating deploy trigger:", error.message);
  return false;
}
