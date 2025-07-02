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

  // Aguardar e interceptar todas as funções
  function waitAndIntercept() {
    let intercepted = 0;

    if (interceptSetDoc()) intercepted++;
    if (interceptAddDoc()) intercepted++;
    if (interceptUpdateDoc()) intercepted++;
    if (interceptFirestoreInstance()) intercepted++;

    if (intercepted < 4) {
      setTimeout(waitAndIntercept, 100);
    } else {
      console.log("✅ UNDEFINED: Todas as funções interceptadas");
    }
  }

  // Iniciar interceptação imediatamente
  waitAndIntercept();

  // Tentar múltiplas vezes
  setTimeout(waitAndIntercept, 1000);
  setTimeout(waitAndIntercept, 3000);
  setTimeout(waitAndIntercept, 5000);

  // Monitor contínuo por 30 segundos
  const monitor = setInterval(() => {
    waitAndIntercept();
  }, 2000);

  setTimeout(() => {
    clearInterval(monitor);
  }, 30000);

  console.log("🧹 UNDEFINED: Sistema de remoção de undefined ativo");
})();
