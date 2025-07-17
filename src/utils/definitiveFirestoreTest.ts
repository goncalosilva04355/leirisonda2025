// DEFINITIVE solution for Firestore configuration with secure environment variables
import { initializeApp, getApps, getApp } from "firebase/app";
import { getUtilFirebaseConfig } from "./firebaseConfigHelper";

// Get configuration from environment variables
const firebaseConfig = getUtilFirebaseConfig();

export async function definitiveFirestoreTest(): Promise<{
  success: boolean;
  message: string;
  action: string;
  data?: any;
}> {
  try {
    console.log("🔥 TESTE DEFINITIVO - Projeto leiria-1cfc9");

    // Passo 1: Inicializar Firebase App
    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    console.log("✅ Firebase App inicializada:", app.options.projectId);

    // Passo 2: Tentar getFirestore - capturar erro getImmediate
    try {
      const { getFirestore } = await import("firebase/firestore");
      const db = getFirestore(app);

      // Se chegou aqui, Firestore está funcionando
      console.log("🎉 Firestore FUNCIONANDO!");

      // Fazer teste de escrita/leitura
      const { doc, setDoc, getDoc, serverTimestamp } = await import(
        "firebase/firestore"
      );
      const testRef = doc(db, "test-definitivo", "sucesso");

      await setDoc(testRef, {
        message: "FIRESTORE FUNCIONANDO!",
        timestamp: serverTimestamp(),
        project: app.options.projectId,
      });

      const docSnap = await getDoc(testRef);

      if (docSnap.exists()) {
        return {
          success: true,
          message:
            "🎉 FIRESTORE TOTALMENTE FUNCIONAL! Os dados estão a ser guardados corretamente.",
          action: "SUCCESS",
          data: {
            projectId: app.options.projectId,
            dataWritten: true,
            dataRead: true,
            document: docSnap.data(),
          },
        };
      } else {
        return {
          success: false,
          message: "Firestore inicializado mas não consegue ler dados",
          action: "CHECK_RULES",
        };
      }
    } catch (firestoreError: any) {
      console.error("❌ Erro Firestore:", firestoreError);

      // Verificar se é o erro getImmediate (Firestore não habilitado)
      if (firestoreError.stack?.includes("getImmediate")) {
        return {
          success: false,
          message:
            "🚨 CONFIRMADO: Firestore NÃO está habilitado no projeto leiria-1cfc9",
          action: "ENABLE_FIRESTORE",
          data: {
            projectId: app.options.projectId,
            error: "getImmediate - serviço não existe",
            consoleUrl: `https://console.firebase.google.com/project/${app.options.projectId}/firestore`,
            authDomain: app.options.authDomain,
          },
        };
      } else {
        return {
          success: false,
          message: `Erro diferente: ${firestoreError.message}`,
          action: "INVESTIGATE",
          data: {
            error: firestoreError.code,
            message: firestoreError.message,
          },
        };
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Erro geral: ${error.message}`,
      action: "CHECK_CONFIG",
      data: { error: error.message },
    };
  }
}

// Função para mostrar instruções específicas
export function getFirestoreInstructions(projectId: string): string {
  return `
🔧 INSTRUÇÕES PARA HABILITAR FIRESTORE NO PROJETO ${projectId.toUpperCase()}:

1. Aceda a: https://console.firebase.google.com/project/${projectId}/firestore

2. Se vir "Cloud Firestore" mas sem base de dados:
   - Clique em "Create database"
   - Escolha "Start in test mode" 
   - Selecione localização: europe-west3 (Frankfurt)
   - Aguarde criação (1-2 minutos)

3. Se já existe uma base de dados mas com erro:
   - Verifique se está na aba "Data" (não "Rules")
   - Confirm que o status é "Active"

4. Verifique as regras de segurança:
   - Vá para aba "Rules"
   - Certifique-se que permite leitura/escrita:
   
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }

5. Após qualquer mudança, aguarde 1-2 minutos e teste novamente.

���️ IMPORTANTE: O projeto correto é "${projectId}" - certifique-se que está no projeto certo!
`;
}
