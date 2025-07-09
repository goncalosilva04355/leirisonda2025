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

// Update deployment manifest
const deployManifest = {
  name: "Leirisonda Obras",
  short_name: "Leirisonda",
  description: "Sistema de gestão de obras e manutenção de piscinas",
  start_url: "/",
  display: "standalone",
  theme_color: "#0066cc",
  background_color: "#ffffff",
  orientation: "portrait",
  scope: "/",
  build_info: buildInfo,
  icons: [
    {
      src: "https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F9862202d056a426996e6178b9981c1c7?format=webp&width=192",
      sizes: "192x192",
      type: "image/webp",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F9862202d056a426996e6178b9981c1c7?format=webp&width=512",
      sizes: "512x512",
      type: "image/webp",
    },
  ],
};

// Write deployment files
try {
  // Update manifest in dist
  const distManifestPath = path.join(__dirname, "dist", "spa", "manifest.json");
  if (fs.existsSync(distManifestPath)) {
    fs.writeFileSync(distManifestPath, JSON.stringify(deployManifest, null, 2));
    console.log("✅ Updated dist/spa/manifest.json");
  }

  // Update public manifest
  const publicManifestPath = path.join(__dirname, "public", "manifest.json");
  if (fs.existsSync(publicManifestPath)) {
    fs.writeFileSync(
      publicManifestPath,
      JSON.stringify(deployManifest, null, 2),
    );
    console.log("✅ Updated public/manifest.json");
  }

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
