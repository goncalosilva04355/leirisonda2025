// Utility functions for safe Response handling to prevent "Body is disturbed or locked" errors

/**
 * Safely read Response as JSON with error handling
 */
export async function safeResponseJson(response: Response): Promise<any> {
  try {
    return await response.json();
  } catch (error) {
    console.error("❌ Erro ao processar JSON da resposta:", error);
    throw new Error("Erro ao processar resposta JSON");
  }
}

/**
 * Safely read Response as text with error handling
 */
export async function safeResponseText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch (error) {
    console.error("❌ Erro ao ler texto da resposta:", error);
    return "Não foi possível ler detalhes do erro";
  }
}

/**
 * Handle Response with proper error reading (clones response to avoid body lock)
 */
export async function handleResponse<T>(
  response: Response,
  successHandler: (response: Response) => Promise<T>,
  options: {
    logPrefix?: string;
    defaultError?: string;
  } = {},
): Promise<T | never> {
  const { logPrefix = "API", defaultError = "Erro na operação" } = options;

  if (response.ok) {
    return await successHandler(response);
  } else {
    // Clone response to avoid "Body is disturbed or locked" error
    const responseClone = response.clone();
    const errorText = await safeResponseText(responseClone);

    const errorMessage = `${defaultError}: HTTP ${response.status} - ${errorText}`;
    console.error(`❌ ${logPrefix}:`, errorMessage);

    throw new Error(errorMessage);
  }
}

/**
 * Safe fetch with automatic response handling
 */
export async function safeFetch(
  url: string,
  options?: RequestInit,
  logPrefix?: string,
): Promise<Response> {
  try {
    const response = await fetch(url, options);

    if (logPrefix) {
      const method = options?.method || "GET";
      console.log(`🌐 ${logPrefix}: ${method} ${url} - ${response.status}`);
    }

    return response;
  } catch (error) {
    if (logPrefix) {
      console.error(`❌ ${logPrefix}: Erro de rede:`, error);
    }
    throw error;
  }
}

export default {
  safeResponseJson,
  safeResponseText,
  handleResponse,
  safeFetch,
};
