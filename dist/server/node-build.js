import path from "path";
import { createServer } from "./index.js";
import * as express from "express";
const app = createServer();
const port = process.env.PORT || 8080;
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "..");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, "0.0.0.0", () => {
  console.log(`\u{1F680} Fusion Starter server running on port ${port}`);
  console.log(`\u{1F4F1} Frontend: http://0.0.0.0:${port}`);
  console.log(`\u{1F527} API: http://0.0.0.0:${port}/api`);
  console.log(`\u{1F49A} Health check: http://0.0.0.0:${port}/health`);
});
process.on("SIGTERM", () => {
  console.log("\u{1F6D1} Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("\u{1F6D1} Received SIGINT, shutting down gracefully");
  process.exit(0);
});
