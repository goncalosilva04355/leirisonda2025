import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo.js";
function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "healthy", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });
  app.get("/api/demo", handleDemo);
  return app;
}
export {
  createServer
};
