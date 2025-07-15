/**
 * ESTABILIZADOR ESPECÍFICO PARA BUILDER.IO
 * Detecta e previne problemas específicos da plataforma Builder.io
 */

class BuilderIoStabilizer {
  private issues: string[] = [];

  constructor() {
    this.initializeStabilization();
  }

  private initializeStabilization() {
    console.log("🔧 Iniciando estabilização específica do Builder.io");

    // 1. DETECTAR IFRAME DO BUILDER.IO
    this.monitorBuilderIframe();

    // 2. INTERCEPTAR POSTMESSAGES PROBLEMÁTICOS
    this.interceptPostMessages();

    // 3. BLOQUEAR HOT RELOAD AUTOMÁTICO
    this.blockHotReload();

    // 4. ESTABILIZAR WEBSOCKETS
    this.stabilizeWebSockets();

    // 5. CONTROLAR DEVELOPMENT SERVER
    this.controlDevServer();

    // 6. MONITOR DE RECURSOS
    this.monitorResources();

    this.reportStatus();
  }

  private monitorBuilderIframe() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (
              element.tagName === "IFRAME" ||
              element.querySelector("iframe")
            ) {
              const iframe =
                element.tagName === "IFRAME"
                  ? element
                  : element.querySelector("iframe");
              const src = iframe?.getAttribute("src") || "";

              if (src.includes("builder.io") || src.includes("preview")) {
                console.log("🔍 Iframe Builder.io detectado:", src);
                this.stabilizeIframe(iframe as HTMLIFrameElement);
              }
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private stabilizeIframe(iframe: HTMLIFrameElement) {
    try {
      // Prevenir que o iframe recarregue a página principal
      iframe.onload = () => {
        console.log("🛡️ Iframe carregado - aplicando estabilização");
      };

      // Bloquear eventos problemáticos do iframe
      iframe.addEventListener("error", (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("🚫 Erro do iframe bloqueado");
      });
    } catch (error) {
      console.log("⚠️ Não foi possível estabilizar iframe:", error);
    }
  }

  private interceptPostMessages() {
    const originalPostMessage = window.postMessage;
    window.postMessage = (message: any, ...args: any[]) => {
      // Bloquear mensagens que podem causar reload
      if (typeof message === "object" && message) {
        if (
          message.type === "RELOAD" ||
          message.type === "REFRESH" ||
          message.action === "reload" ||
          message.command === "refresh"
        ) {
          console.log("🚫 PostMessage de reload bloqueado:", message);
          return;
        }
      }

      return originalPostMessage.call(window, message, ...args);
    };

    // Interceptar mensagens recebidas
    window.addEventListener(
      "message",
      (event) => {
        const data = event.data;

        if (typeof data === "object" && data) {
          // Bloquear comandos perigosos
          if (
            data.type === "RELOAD" ||
            data.type === "REFRESH" ||
            data.action === "reload" ||
            data.command === "refresh" ||
            data.type === "HOT_RELOAD"
          ) {
            event.stopImmediatePropagation();
            event.preventDefault();
            console.log("🚫 PostMessage perigoso bloqueado:", data);
            this.issues.push(
              `PostMessage bloqueado: ${data.type || data.action}`,
            );
          }
        }
      },
      true,
    ); // Use capture phase para interceptar antes
  }

  private blockHotReload() {
    // Bloquear HMR (Hot Module Replacement)
    if ("webpackHotUpdate" in window) {
      (window as any).webpackHotUpdate = () => {
        console.log("🚫 WebpackHotUpdate bloqueado");
        this.issues.push("WebpackHotUpdate bloqueado");
      };
    }

    // Bloquear Vite HMR
    if ("__vite__" in window) {
      const vite = (window as any).__vite__;
      if (vite && vite.createHotContext) {
        const originalCreateHotContext = vite.createHotContext;
        vite.createHotContext = () => {
          console.log("🚫 Vite HMR bloqueado");
          return {
            accept: () => {},
            dispose: () => {},
            decline: () => {},
            invalidate: () => {},
          };
        };
      }
    }
  }

  private stabilizeWebSockets() {
    const originalWebSocket = window.WebSocket;
    window.WebSocket = class extends WebSocket {
      constructor(url: string | URL, protocols?: string | string[]) {
        super(url, protocols);

        console.log("🔍 WebSocket criado:", url);

        // Interceptar mensagens que podem causar reload
        this.addEventListener("message", (event) => {
          try {
            const data = JSON.parse(event.data);
            if (
              data.type === "full-reload" ||
              data.type === "reload" ||
              data.command === "reload"
            ) {
              console.log("🚫 WebSocket reload message bloqueado:", data);
              event.stopImmediatePropagation();
            }
          } catch (e) {
            // Não é JSON, ignorar
          }
        });
      }
    };
  }

  private controlDevServer() {
    // Interceptar fetch requests para dev server
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();

      // Bloquear requests que podem triggerar reload
      if (
        url.includes("__vite_ping") ||
        url.includes("__webpack_hmr") ||
        url.includes("/hot-update/")
      ) {
        console.log("🚫 Dev server request bloqueado:", url);
        throw new Error("Dev server request bloqueado para estabilidade");
      }

      return originalFetch(input, init);
    };
  }

  private monitorResources() {
    // Monitor de recursos carregados
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (
          entry.name.includes("hot-update") ||
          entry.name.includes("hmr") ||
          (entry.name.includes("vite") && entry.name.includes("client"))
        ) {
          console.log(
            "🚫 Recurso de hot-reload detectado e será ignorado:",
            entry.name,
          );
          this.issues.push(`Recurso HMR detectado: ${entry.name}`);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ["resource"] });
    } catch (error) {
      console.log("⚠️ Performance Observer não suportado");
    }
  }

  private reportStatus() {
    setInterval(() => {
      if (this.issues.length > 0) {
        console.group("🛡️ Builder.io Stabilizer - Issues Blocked:");
        this.issues.forEach((issue, index) => {
          console.log(`${index + 1}. ${issue}`);
        });
        console.groupEnd();

        // Limpar issues antigas (manter apenas últimas 10)
        if (this.issues.length > 10) {
          this.issues = this.issues.slice(-10);
        }
      } else {
        console.log("✅ Builder.io Stabilizer - Nenhum problema detectado");
      }
    }, 30000); // A cada 30 segundos
  }

  getStatus() {
    return {
      issuesBlocked: this.issues.length,
      recentIssues: this.issues.slice(-5),
      timestamp: new Date().toISOString(),
    };
  }
}

// Inicializar estabilizador
const builderStabilizer = new BuilderIoStabilizer();

// Expor globalmente para debug
(window as any).builderStabilizer = builderStabilizer;

console.log(
  "🛡️ Builder.io Stabilizer ativo. Use window.builderStabilizer.getStatus() para status.",
);

export default BuilderIoStabilizer;
