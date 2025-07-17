// Firebase Project Validation Utility
// Check if Firebase project and API key are valid before making requests

/**
 * Validate if a Firebase project exists and API key is valid
 */
export async function validateFirebaseProject(
  projectId: string,
  apiKey: string,
): Promise<{
  valid: boolean;
  error?: string;
  details?: any;
}> {
  try {
    console.log(`🔍 Validando projeto Firebase: ${projectId}`);

    // Test with a simple Identity Toolkit API call (lightweight)
    const testUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

    const response = await fetch(testUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(5000),
    });

    console.log(`📋 Validation response status: ${response.status}`);

    if (response.status === 400) {
      // 400 is expected for empty body, but means API key is valid
      console.log("✅ API key é válida");
      return { valid: true };
    } else if (response.status === 403) {
      console.log("❌ API key inválida ou sem permissões");
      return {
        valid: false,
        error: "API key inválida ou sem permissões",
        details: { status: response.status },
      };
    } else if (response.status === 404) {
      console.log("❌ Projeto Firebase não encontrado");
      return {
        valid: false,
        error: "Projeto Firebase não encontrado",
        details: { status: response.status, projectId },
      };
    } else {
      // Try to read the response for more details
      let responseText = "";
      try {
        responseText = await response.text();
      } catch {}

      return {
        valid: false,
        error: `Status inesperado: ${response.status}`,
        details: { status: response.status, response: responseText },
      };
    }
  } catch (error: any) {
    console.error("❌ Erro na validação do projeto Firebase:", error);

    if (error.name === "AbortError") {
      return {
        valid: false,
        error: "Timeout na validação - verificar conectividade",
        details: { timeout: true },
      };
    } else if (error.message === "Load failed") {
      return {
        valid: false,
        error: "Falha de rede - verificar conectividade ou CORS",
        details: { networkError: true },
      };
    } else {
      return {
        valid: false,
        error: `Erro de validação: ${error.message}`,
        details: { error: error.message },
      };
    }
  }
}

/**
 * Test Firestore access specifically
 */
export async function validateFirestoreAccess(
  projectId: string,
  apiKey: string,
): Promise<{
  valid: boolean;
  error?: string;
  details?: any;
}> {
  try {
    console.log(`🔍 Testando acesso ao Firestore: ${projectId}`);

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents?key=${apiKey}`;

    const response = await fetch(firestoreUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });

    console.log(`📋 Firestore test response: ${response.status}`);

    if (response.ok) {
      console.log("✅ Firestore acessível");
      return { valid: true };
    } else if (response.status === 403) {
      return {
        valid: false,
        error: "Firestore bloqueado por regras de segurança",
        details: { status: response.status },
      };
    } else if (response.status === 404) {
      return {
        valid: false,
        error: "Firestore não encontrado ou não habilitado",
        details: { status: response.status },
      };
    } else {
      let responseText = "";
      try {
        responseText = await response.text();
      } catch {}

      return {
        valid: false,
        error: `Erro Firestore: ${response.status}`,
        details: { status: response.status, response: responseText },
      };
    }
  } catch (error: any) {
    console.error("❌ Erro no teste do Firestore:", error);

    return {
      valid: false,
      error: `Erro no teste Firestore: ${error.message}`,
      details: { error: error.message },
    };
  }
}

export default {
  validateFirebaseProject,
  validateFirestoreAccess,
};
