interface LogEntry {
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  details?: any;
}

class VisualCleanupLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 50;
  private logContainer: HTMLElement | null = null;

  constructor() {
    this.createLogContainer();
    this.interceptConsole();
  }

  private createLogContainer() {
    // Criar container para logs se não existir
    if (!document.getElementById("cleanup-logger")) {
      const container = document.createElement("div");
      container.id = "cleanup-logger";
      container.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 400px;
        max-height: 300px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        font-family: monospace;
        font-size: 12px;
        border-radius: 8px;
        padding: 10px;
        overflow-y: auto;
        z-index: 10000;
        display: none;
      `;

      const header = document.createElement("div");
      header.innerHTML = `
        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
          <strong>🧹 Cleanup Logger</strong>
          <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" 
                  style="background: #f56565; color: white; border: none; border-radius: 4px; padding: 2px 6px; cursor: pointer; margin-left: auto;">×</button>
        </div>
      `;

      const logArea = document.createElement("div");
      logArea.id = "cleanup-logs";

      container.appendChild(header);
      container.appendChild(logArea);
      document.body.appendChild(container);

      this.logContainer = container;
    }
  }

  private interceptConsole() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog.apply(console, args);
      if (this.shouldCapture(args[0])) {
        this.addLog("info", args.join(" "));
      }
    };

    console.warn = (...args) => {
      originalWarn.apply(console, args);
      if (this.shouldCapture(args[0])) {
        this.addLog("warning", args.join(" "));
      }
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      if (this.shouldCapture(args[0])) {
        this.addLog("error", args.join(" "));
      }
    };
  }

  private shouldCapture(message: string): boolean {
    if (typeof message !== "string") return false;

    const keywords = [
      "🧹",
      "🗑️",
      "💀",
      "🔄",
      "🚨",
      "✅",
      "❌",
      "⚠️",
      "ELIMINANDO",
      "DUPLICADOS",
      "CLEANUP",
      "DELETE",
      "REMOVED",
    ];

    return keywords.some((keyword) => message.includes(keyword));
  }

  addLog(type: LogEntry["type"], message: string, details?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      details,
    };

    this.logs.push(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.updateLogDisplay();

    // Mostrar logger se houver atividade de cleanup
    if (this.logContainer) {
      this.logContainer.style.display = "block";
    }
  }

  private updateLogDisplay() {
    const logArea = document.getElementById("cleanup-logs");
    if (!logArea) return;

    logArea.innerHTML = this.logs
      .map((log) => {
        const color = {
          info: "#60a5fa",
          success: "#34d399",
          warning: "#fbbf24",
          error: "#f87171",
        }[log.type];

        return `
        <div style="margin-bottom: 5px; padding: 3px; border-left: 3px solid ${color}; padding-left: 8px;">
          <span style="color: #9ca3af;">[${log.timestamp}]</span>
          <span style="color: ${color};">${log.message}</span>
        </div>
      `;
      })
      .join("");

    // Auto-scroll para o final
    logArea.scrollTop = logArea.scrollHeight;
  }

  show() {
    if (this.logContainer) {
      this.logContainer.style.display = "block";
    }
  }

  hide() {
    if (this.logContainer) {
      this.logContainer.style.display = "none";
    }
  }

  clear() {
    this.logs = [];
    this.updateLogDisplay();
  }
}

// Criar instância global
const logger = new VisualCleanupLogger();

// Disponibilizar globalmente
(window as any).cleanupLogger = logger;
(window as any).showCleanupLogger = () => logger.show();
(window as any).hideCleanupLogger = () => logger.hide();

console.log(
  "📺 VISUAL LOGGER: Digite 'showCleanupLogger()' para ver logs em tempo real",
);

export default logger;
