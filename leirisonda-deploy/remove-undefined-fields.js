// REMOVE UNDEFINED FIELDS - Remove campos undefined antes do Firebase

console.log(
  "🧹 UNDEFINED REMOVER: Iniciando remoção agressiva de campos undefined...",
);

(function () {
  "use strict";

  // Função para remover completamente campos undefined
  function removeUndefinedFields(obj) {
    if (obj === null || obj === undefined) {
      return null;
    }

    if (Array.isArray(obj)) {
      return obj
        .map((item) => removeUndefinedFields(item))
        .filter((item) => item !== undefined && item !== null);
    }

    if (typeof obj === "object") {
      const cleaned = {};

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];

          // Remover completamente se undefined
          if (value === undefined) {
            console.warn(`🧹 UNDEFINED: Campo ${key} removido (undefined)`);
            continue;
          }

          // Tratar campos problemáticos específicos
          if (
            key === "exitTime" &&
            (value === undefined || value === null || value === "")
          ) {
            console.warn(
              `🧹 UNDEFINED: exitTime problemático removido:`,
              value,
            );
            continue;
          }

          // Limpar recursivamente
          const cleanedValue = removeUndefinedFields(value);
          if (cleanedValue !== undefined) {
            cleaned[key] = cleanedValue;
          }
        }
      }

      return cleaned;
    }

    return obj;
  }

  // Interceptar setDoc global
  function interceptSetDoc() {
    if (window.setDoc) {
      const originalSetDoc = window.setDoc;

      window.setDoc = function (docRef, data, options) {
        console.log("🧹 UNDEFINED: setDoc interceptado - removendo undefined");
        console.log("🧹 UNDEFINED: Dados originais:", data);

        const cleanedData = removeUndefinedFields(data);
        console.log("🧹 UNDEFINED: Dados limpos:", cleanedData);

        return originalSetDoc(docRef, cleanedData, options);
      };

      console.log("✅ UNDEFINED: setDoc interceptado");
      return true;
    }
    return false;
  }

  // Interceptar addDoc global
  function interceptAddDoc() {
    if (window.addDoc) {
      const originalAddDoc = window.addDoc;

      window.addDoc = function (collectionRef, data) {
        console.log("🧹 UNDEFINED: addDoc interceptado - removendo undefined");
        console.log("🧹 UNDEFINED: Dados originais:", data);

        const cleanedData = removeUndefinedFields(data);
        console.log("🧹 UNDEFINED: Dados limpos:", cleanedData);

        return originalAddDoc(collectionRef, cleanedData);
      };

      console.log("✅ UNDEFINED: addDoc interceptado");
      return true;
    }
    return false;
  }

  // Interceptar updateDoc global
  function interceptUpdateDoc() {
    if (window.updateDoc) {
      const originalUpdateDoc = window.updateDoc;

      window.updateDoc = function (docRef, data) {
        console.log(
          "🧹 UNDEFINED: updateDoc interceptado - removendo undefined",
        );
        console.log("🧹 UNDEFINED: Dados originais:", data);

        const cleanedData = removeUndefinedFields(data);
        console.log("🧹 UNDEFINED: Dados limpos:", cleanedData);

        return originalUpdateDoc(docRef, cleanedData);
      };

      console.log("✅ UNDEFINED: updateDoc interceptado");
      return true;
    }
    return false;
  }

  // Interceptar Firestore instance methods
  function interceptFirestoreInstance() {
    if (window.firebase && window.firebase.firestore) {
      try {
        const firestore = window.firebase.firestore();

        // Interceptar collection().add()
        const originalCollection = firestore.collection;
        firestore.collection = function (path) {
          const collection = originalCollection.call(this, path);

          // Interceptar add()
          const originalAdd = collection.add;
          collection.add = function (data) {
            console.log("🧹 UNDEFINED: collection.add interceptado");
            const cleanedData = removeUndefinedFields(data);
            console.log("🧹 UNDEFINED: Dados limpos:", cleanedData);
            return originalAdd.call(this, cleanedData);
          };

          // Interceptar doc().set()
          const originalDoc = collection.doc;
          collection.doc = function (docId) {
            const docRef = originalDoc.call(this, docId);

            const originalSet = docRef.set;
            docRef.set = function (data, options) {
              console.log("🧹 UNDEFINED: doc.set interceptado");
              const cleanedData = removeUndefinedFields(data);
              console.log("🧹 UNDEFINED: Dados limpos:", cleanedData);
              return originalSet.call(this, cleanedData, options);
            };

            const originalUpdate = docRef.update;
            docRef.update = function (data) {
              console.log("🧹 UNDEFINED: doc.update interceptado");
              const cleanedData = removeUndefinedFields(data);
              console.log("🧹 UNDEFINED: Dados limpos:", cleanedData);
              return originalUpdate.call(this, cleanedData);
            };

            return docRef;
          };

          return collection;
        };

        console.log("✅ UNDEFINED: Firestore instance interceptado");
        return true;
      } catch (e) {
        console.error("🧹 UNDEFINED: Erro ao interceptar Firestore:", e);
        return false;
      }
    }
    return false;
  }

  // Interceptar TODAS as possíveis funções de escrita do Firebase
  function interceptAllFirebaseMethods() {
    // Interceptar via módulos globais se disponíveis
    if (typeof setDoc !== "undefined") {
      const original = setDoc;
      window.setDoc = function (docRef, data, options) {
        console.log("🧹 UNDEFINED: Global setDoc interceptado");
        const cleaned = removeUndefinedFields(data);
        return original(docRef, cleaned, options);
      };
    }

    if (typeof addDoc !== "undefined") {
      const original = addDoc;
      window.addDoc = function (collectionRef, data) {
        console.log("🧹 UNDEFINED: Global addDoc interceptado");
        const cleaned = removeUndefinedFields(data);
        return original(collectionRef, cleaned);
      };
    }

    if (typeof updateDoc !== "undefined") {
      const original = updateDoc;
      window.updateDoc = function (docRef, data) {
        console.log("🧹 UNDEFINED: Global updateDoc interceptado");
        const cleaned = removeUndefinedFields(data);
        return original(docRef, cleaned);
      };
    }

    // Interceptar fetch direto para Firestore
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
      if (typeof url === "string" && url.includes("firestore.googleapis.com")) {
        if (options && options.body) {
          try {
            let body = options.body;
            if (typeof body === "string") {
              const parsed = JSON.parse(body);
              if (parsed.writes || parsed.fields) {
                console.log("🧹 UNDEFINED: Firestore fetch interceptado");
                const cleaned = removeUndefinedFields(parsed);
                options.body = JSON.stringify(cleaned);
              }
            }
          } catch (e) {
            // Ignorar erros de parsing
          }
        }
      }
      return originalFetch.apply(this, arguments);
    };
  }

  // Aguardar e interceptar todas as funções
  function waitAndIntercept() {
    let intercepted = 0;

    if (interceptSetDoc()) intercepted++;
    if (interceptAddDoc()) intercepted++;
    if (interceptUpdateDoc()) intercepted++;
    if (interceptFirestoreInstance()) intercepted++;

    // Interceptar métodos adicionais
    interceptAllFirebaseMethods();

    console.log(`🧹 UNDEFINED: ${intercepted} funções interceptadas`);
  }

  // Interceptação imediata e agressiva
  waitAndIntercept();

  // Interceptar a cada 500ms por 1 minuto
  let attempts = 0;
  const aggressiveMonitor = setInterval(() => {
    attempts++;
    waitAndIntercept();

    if (attempts > 120) {
      // 60 segundos / 0.5 = 120 tentativas
      clearInterval(aggressiveMonitor);
    }
  }, 500);

  // Interceptar também quando Firebase carrega
  const firebaseWaiter = setInterval(() => {
    if (window.firebase) {
      waitAndIntercept();
    }
  }, 100);

  setTimeout(() => {
    clearInterval(firebaseWaiter);
  }, 60000);

  console.log("🧹 UNDEFINED: Sistema de remoção de undefined ativo");
})();
