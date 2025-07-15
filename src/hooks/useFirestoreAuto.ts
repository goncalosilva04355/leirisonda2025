// Hook que automaticamente usa REST API se disponível, senão usa localStorage
import { useState, useEffect } from "react";
import {
  useFirestoreREST,
  isFirestoreRESTEnabled,
} from "../services/firestoreIntegration";

export function useFirestoreAuto() {
  const [isRESTActive, setIsRESTActive] = useState(false);
  const restService = useFirestoreREST();

  useEffect(() => {
    // Verificar se REST API está ativa
    const checkRESTStatus = () => {
      const isActive = isFirestoreRESTEnabled();
      setIsRESTActive(isActive);

      if (isActive) {
        console.log("✅ Usando Firestore via REST API");
      } else {
        console.log("📱 Usando localStorage como fallback");
      }
    };

    checkRESTStatus();

    // Verificar periodicamente se REST API foi ativada
    const interval = setInterval(checkRESTStatus, 3000);

    return () => clearInterval(interval);
  }, []);

  // Funções que automaticamente escolhem REST API ou localStorage
  const addObra = async (data: any) => {
    if (isRESTActive) {
      try {
        return await restService.addObra(data);
      } catch (error) {
        console.warn("REST API falhou, usando localStorage:", error);
        // Fallback para localStorage
      }
    }

    // Fallback localStorage
    const obras = JSON.parse(localStorage.getItem("obras") || "[]");
    const newObra = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    obras.push(newObra);
    localStorage.setItem("obras", JSON.stringify(obras));
    return newObra;
  };

  const addPiscina = async (data: any) => {
    if (isRESTActive) {
      try {
        return await restService.addPiscina(data);
      } catch (error) {
        console.warn("REST API falhou, usando localStorage:", error);
      }
    }

    // Fallback localStorage
    const piscinas = JSON.parse(localStorage.getItem("piscinas") || "[]");
    const newPiscina = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    piscinas.push(newPiscina);
    localStorage.setItem("piscinas", JSON.stringify(piscinas));
    return newPiscina;
  };

  const addManutencao = async (data: any) => {
    if (isRESTActive) {
      try {
        return await restService.addManutencao(data);
      } catch (error) {
        console.warn("REST API falhou, usando localStorage:", error);
      }
    }

    // Fallback localStorage
    const manutencoes = JSON.parse(localStorage.getItem("manutencoes") || "[]");
    const newManutencao = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    manutencoes.push(newManutencao);
    localStorage.setItem("manutencoes", JSON.stringify(manutencoes));
    return newManutencao;
  };

  const addCliente = async (data: any) => {
    if (isRESTActive) {
      try {
        return await restService.addCliente(data);
      } catch (error) {
        console.warn("REST API falhou, usando localStorage:", error);
      }
    }

    // Fallback localStorage
    const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
    const newCliente = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    clientes.push(newCliente);
    localStorage.setItem("clientes", JSON.stringify(clientes));
    return newCliente;
  };

  const syncData = async () => {
    if (isRESTActive) {
      try {
        return await restService.syncFromFirestore();
      } catch (error) {
        console.warn("Sincronização REST API falhou:", error);
        return false;
      }
    }
    return false;
  };

  return {
    addObra,
    addPiscina,
    addManutencao,
    addCliente,
    syncData,
    isRESTActive,
    isWorking: true, // Sistema sempre funciona (REST API ou localStorage)
  };
}
