/**
 * Builder.io Blocker - Prevents Builder.io scripts and requests
 */

class BuilderIoBlocker {
  private static instance: BuilderIoBlocker;
  private isBlocked = false;

  private constructor() {}

  public static getInstance(): BuilderIoBlocker {
    if (!BuilderIoBlocker.instance) {
      BuilderIoBlocker.instance = new BuilderIoBlocker();
    }
    return BuilderIoBlocker.instance;
  }

  public blockBuilderIo(): void {
    if (this.isBlocked) return;

    this.isBlocked = true;
    console.log("🚫 Blocking Builder.io");

    // Block Builder.io domains
    this.blockBuilderIoDomains();

    // Block Builder.io scripts
    this.blockBuilderIoScripts();

    // Prevent Builder.io intervals and timeouts
    this.blockBuilderIoTimers();
  }

  private blockBuilderIoDomains(): void {
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const url = args[0] as string;
      if (typeof url === "string" && url.includes("builder.io")) {
        console.log("🚫 Blocked Builder.io request:", url);
        return Promise.reject(new Error("Builder.io blocked"));
      }
      return originalFetch.apply(this, args);
    };

    // Block XMLHttpRequest to Builder.io
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL,
      ...rest: any[]
    ) {
      if (typeof url === "string" && url.includes("builder.io")) {
        console.log("🚫 Blocked Builder.io XHR:", url);
        throw new Error("Builder.io blocked");
      }
      return originalXHROpen.apply(this, [method, url, ...rest]);
    };
  }

  private blockBuilderIoScripts(): void {
    // Remove existing Builder.io scripts
    const scripts = document.querySelectorAll('script[src*="builder.io"]');
    scripts.forEach((script) => {
      console.log("🚫 Removing Builder.io script:", script.getAttribute("src"));
      script.remove();
    });

    // Prevent new Builder.io scripts from loading
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === "SCRIPT") {
              const src = element.getAttribute("src");
              if (src && src.includes("builder.io")) {
                console.log("🚫 Blocked Builder.io script injection:", src);
                element.remove();
              }
            }
          }
        });
      });
    });

    observer.observe(document.head || document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  private blockBuilderIoTimers(): void {
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;

    window.setInterval = function (
      callback: Function,
      delay: number,
      ...args: any[]
    ) {
      const stack = new Error().stack || "";
      if (stack.includes("builder.io") || stack.includes("Builder")) {
        console.log("🚫 Blocked Builder.io setInterval");
        return -1 as any;
      }
      return originalSetInterval.call(this, callback, delay, ...args);
    };

    window.setTimeout = function (
      callback: Function,
      delay: number,
      ...args: any[]
    ) {
      const stack = new Error().stack || "";
      if (stack.includes("builder.io") || stack.includes("Builder")) {
        console.log("🚫 Blocked Builder.io setTimeout");
        return -1 as any;
      }
      return originalSetTimeout.call(this, callback, delay, ...args);
    };
  }

  public isBuilderIoBlocked(): boolean {
    return this.isBlocked;
  }
}

export const builderIoBlocker = BuilderIoBlocker.getInstance();
