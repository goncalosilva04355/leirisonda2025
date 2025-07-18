import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

async function buildServer() {
  try {
    console.log("🔧 Building server...");

    // Ensure dist/server directory exists
    await fs.mkdir("dist/server", { recursive: true });
    await fs.mkdir("dist/server/routes", { recursive: true });
    await fs.mkdir("dist/shared", { recursive: true });

    // Copy and transpile server files
    const serverFiles = [
      "server/index.ts",
      "server/node-build.ts",
      "server/routes/demo.ts",
      "shared/api.ts",
      "shared/types.ts",
    ];

    // Use esbuild for faster compilation
    const { stdout, stderr } = await execAsync(
      `npx esbuild ${serverFiles.join(" ")} --outdir=dist --platform=node --format=esm --target=node18`,
    );

    if (stderr) {
      console.warn("⚠️ Build warnings:", stderr);
    }

    console.log("✅ Server built successfully!");
    console.log(stdout);
  } catch (error) {
    console.error("❌ Server build failed:", error);
    process.exit(1);
  }
}

buildServer();
