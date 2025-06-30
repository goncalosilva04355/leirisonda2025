import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { sendNotification, testFirebaseAdmin } from "./routes/notifications";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" })); // Aumentar limite para notificações com dados
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Notification endpoints
  app.post("/api/send-notification", sendNotification);
  app.get("/api/test-firebase-admin", testFirebaseAdmin);

  return app;
}
