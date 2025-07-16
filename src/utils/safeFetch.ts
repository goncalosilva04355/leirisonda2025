// Safe fetch wrapper that handles "Load failed" errors gracefully
export async function safeFetch(
  url: string,
  options?: RequestInit,
): Promise<{
  success: boolean;
  response?: Response;
  data?: any;
  error?: string;
}> {
  try {
    console.log("🌐 Safe fetch para:", url);

    const response = await fetch(url, {
      ...options,
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000),
    });

    console.log("✅ Safe fetch sucesso:", response.status);

    return {
      success: true,
      response,
    };
  } catch (error: any) {
    const errorMessage = error.message || String(error);

    if (
      errorMessage.includes("Load failed") ||
      errorMessage.includes("Failed to fetch")
    ) {
      console.warn("⚠️ Load failed em fetch - usando fallback:", url);

      return {
        success: false,
        error: "network_blocked",
        data: {
          originalError: errorMessage,
          fallbackAvailable: true,
          explanation: "Requisição bloqueada - sistema usa fallback local",
        },
      };
    }

    if (errorMessage.includes("timeout") || error.name === "AbortError") {
      console.warn("⏱️ Timeout em fetch:", url);

      return {
        success: false,
        error: "timeout",
        data: {
          originalError: errorMessage,
          explanation: "Timeout - possivelmente serviço indisponível",
        },
      };
    }

    // Other fetch errors
    console.warn("⚠️ Outro erro em fetch:", errorMessage);

    return {
      success: false,
      error: "fetch_error",
      data: {
        originalError: errorMessage,
        fallbackAvailable: true,
      },
    };
  }
}

// Override global fetch temporarily for critical startup period
const originalFetch = window.fetch;

window.fetch = async function (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await originalFetch(input, init);
  } catch (error: any) {
    if (error.message?.includes("Load failed")) {
      console.warn("⚠️ Global fetch Load failed interceptado:", String(input));

      // Throw a more descriptive error
      const enhancedError = new Error(
        "Network request blocked (Load failed) - using fallback",
      );
      enhancedError.name = "NetworkBlockedError";
      (enhancedError as any).originalError = error;
      (enhancedError as any).fallbackAvailable = true;

      throw enhancedError;
    }

    throw error;
  }
};

// Restore original fetch after startup
setTimeout(() => {
  window.fetch = originalFetch;
  console.log("🌐 Global fetch override removido");
}, 15000);

export default safeFetch;
