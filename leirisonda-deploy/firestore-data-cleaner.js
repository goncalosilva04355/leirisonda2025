// FIRESTORE DATA CLEANER - Remove valores undefined antes de salvar

console.log("🧹 FIRESTORE CLEANER: Iniciando limpeza de dados...");

(function () {
  "use strict";

  // Função para limpar objeto removendo valores undefined
  function cleanData(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(cleanData).filter((item) => item !== undefined);
    }

    const cleaned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        // Pular campos undefined
        if (value === undefined) {
          console.warn(`🧹 Campo ${key} removido (undefined)`);
          continue;
        }

        // Pular campos null se necessário (opcional)
        if (value === null) {
          console.warn(`🧹 Campo ${key} convertido de null para string vazia`);
          cleaned[key] = "";
          continue;
        }

        // Limpar objetos aninhados
        if (typeof value === "object") {
          const cleanedValue = cleanData(value);
          if (cleanedValue !== undefined) {
            cleaned[key] = cleanedValue;
          }
        } else {
          cleaned[key] = value;
        }
      }
    }

    return cleaned;
  }

  // Interceptar operações Firestore
  function interceptFirestore() {
    if (window.firebase && window.firebase.firestore) {
      try {
        const firestore = window.firebase.firestore();

        // Interceptar collection().doc().set()
        const originalCollection = firestore.collection;
        firestore.collection = function (path) {
          const collection = originalCollection.call(this, path);

          // Interceptar doc().set()
          const originalDoc = collection.doc;
          collection.doc = function (docId) {
            const doc = originalDoc.call(this, docId);

            // Interceptar set()
            const originalSet = doc.set;
            doc.set = function (data, options) {
              console.log("🧹 Interceptando set() para:", path, docId);

              const cleanedData = cleanData(data);
              console.log("🧹 Dados limpos:", cleanedData);

              return originalSet.call(this, cleanedData, options);
            };

            // Interceptar update()
            const originalUpdate = doc.update;
            doc.update = function (data) {
              console.log("🧹 Interceptando update() para:", path, docId);

              const cleanedData = cleanData(data);
              console.log("🧹 Dados limpos:", cleanedData);

              return originalUpdate.call(this, cleanedData);
            };

            return doc;
          };

          // Interceptar add()
          const originalAdd = collection.add;
          collection.add = function (data) {
            console.log("🧹 Interceptando add() para:", path);

            const cleanedData = cleanData(data);
            console.log("🧹 Dados limpos:", cleanedData);

            return originalAdd.call(this, cleanedData);
          };

          return collection;
        };

        console.log("✅ Firestore interceptado para limpeza de dados");
      } catch (e) {
        console.log("❌ Erro ao interceptar Firestore:", e.message);
      }
    }
  }

  // Interceptar setDoc global se estiver disponível
  function interceptGlobalFirestore() {
    // Verificar se existem funções globais do Firestore
    if (window.setDoc) {
      const originalSetDoc = window.setDoc;
      window.setDoc = function (docRef, data, options) {
        console.log("🧹 Interceptando setDoc global");

        const cleanedData = cleanData(data);
        console.log("🧹 Dados limpos para setDoc:", cleanedData);

        return originalSetDoc(docRef, cleanedData, options);
      };

      console.log("✅ setDoc global interceptado");
    }

    if (window.updateDoc) {
      const originalUpdateDoc = window.updateDoc;
      window.updateDoc = function (docRef, data) {
        console.log("🧹 Interceptando updateDoc global");

        const cleanedData = cleanData(data);
        console.log("🧹 Dados limpos para updateDoc:", cleanedData);

        return originalUpdateDoc(docRef, cleanedData);
      };

      console.log("✅ updateDoc global interceptado");
    }

    if (window.addDoc) {
      const originalAddDoc = window.addDoc;
      window.addDoc = function (collectionRef, data) {
        console.log("🧹 Interceptando addDoc global");

        const cleanedData = cleanData(data);
        console.log("🧹 Dados limpos para addDoc:", cleanedData);

        return originalAddDoc(collectionRef, cleanedData);
      };

      console.log("✅ addDoc global interceptado");
    }
  }

  // Configurar interceptores
  const setupCleaners = () => {
    interceptFirestore();
    interceptGlobalFirestore();
  };

  // Tentar configurar imediatamente
  setupCleaners();

  // Aguardar Firebase carregar
  const checkFirebase = setInterval(() => {
    if (window.firebase && window.firebase.firestore) {
      setupCleaners();
      clearInterval(checkFirebase);
    }
  }, 100);

  // Parar verificação após 10 segundos
  setTimeout(() => {
    clearInterval(checkFirebase);
  }, 10000);

  // Configurar novamente quando a aplicação carregar
  setTimeout(() => {
    setupCleaners();
  }, 5000);

  console.log("✅ FIRESTORE DATA CLEANER: Sistema ativo");
})();
