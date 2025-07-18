// Teste ULTRA SIMPLES - apenas verificar se o projeto Firebase existe
export async function ultraSimpleFirebaseTest(): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    console.log("🔥 Teste ultra simples do Firebase...");

    // Teste 1: Verificar se conseguimos fazer uma requisi��ão HTTP simples ao Firebase
    const projectId = "leiria-1cfc9";
    const testUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

    console.log("📡 Testando conectividade HTTP com Firebase...");

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("📡 Resposta HTTP:", response.status, response.statusText);

    if (response.status === 401) {
      // 401 é esperado sem autenticação - mas significa que o Firestore existe
      return {
        success: true,
        message:
          "Firestore está ativo e acessível (erro 401 é normal sem auth)",
        data: {
          status: response.status,
          statusText: response.statusText,
          projectId: projectId,
          firestoreUrl: testUrl,
        },
      };
    } else if (response.status === 403) {
      // 403 também pode ser normal se existir mas sem permissões
      return {
        success: true,
        message:
          "Firestore existe mas precisa de autenticação (erro 403 é normal)",
        data: {
          status: response.status,
          statusText: response.statusText,
          projectId: projectId,
        },
      };
    } else if (response.status === 404) {
      // 404 significa que o Firestore não existe no projeto
      return {
        success: false,
        message: "Firestore não existe no projeto ou não está habilitado",
        data: {
          status: response.status,
          statusText: response.statusText,
          projectId: projectId,
          solution: `Vá para https://console.firebase.google.com/project/${projectId}/firestore e habilite o Firestore`,
        },
      };
    } else {
      // Outras respostas
      return {
        success: true,
        message: `Resposta inesperada mas Firestore parece acessível: ${response.status}`,
        data: {
          status: response.status,
          statusText: response.statusText,
          projectId: projectId,
        },
      };
    }
  } catch (error: any) {
    console.error("❌ Erro no teste ultra simples:", error);

    // Verificar se é erro de rede
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("Network")
    ) {
      return {
        success: false,
        message: "Problema de conectividade com a internet ou Firebase",
        data: { error: error.message },
      };
    }

    return {
      success: false,
      message: `Erro inesperado: ${error.message}`,
      data: { error: error.message, stack: error.stack },
    };
  }
}
