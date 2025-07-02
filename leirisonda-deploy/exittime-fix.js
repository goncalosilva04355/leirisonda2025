// EXITTIME FIX - Correção específica para campo exitTime undefined

console.log("🎯 EXITTIME FIX: Iniciando correção específica para exitTime...");

(function () {
  "use strict";

  // Função para limpar especificamente exitTime
  function cleanExitTimeFields(obj) {
    if (!obj || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => cleanExitTimeFields(item));
    }

    const cleaned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        // Remover exitTime se undefined, null ou string vazia
        if (
          key === "exitTime" &&
          (value === undefined || value === null || value === "")
        ) {
          console.warn(`🎯 EXITTIME: Campo exitTime removido (${value})`);
          continue; // Não incluir este campo
        }

        // Processar recursivamente
        cleaned[key] = cleanExitTimeFields(value);
      }
    }

    return cleaned;
  }

  // Interceptar localStorage setItem para obras
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    if (key === "works" || key === "leirisonda_works" || key.includes("work")) {
      try {
        const data = JSON.parse(value);
        const cleanedData = cleanExitTimeFields(data);
        const cleanedValue = JSON.stringify(cleanedData);

        if (cleanedValue !== value) {
          console.log(`🎯 EXITTIME: Dados limpos em localStorage ${key}`);
        }

        return originalSetItem.call(this, key, cleanedValue);
      } catch (e) {
        // Se não conseguir fazer parse, usar valor original
        return originalSetItem.call(this, key, value);
      }
    }

    return originalSetItem.call(this, key, value);
  };

  // Interceptar todas as operações possíveis do Firebase
  function setupFirebaseInterception() {
    // Interceptar setDoc global
    if (typeof setDoc !== "undefined") {
      const originalSetDoc = setDoc;
      window.setDoc = function (docRef, data, options) {
        console.log("🎯 EXITTIME: setDoc interceptado");
        const cleanedData = cleanExitTimeFields(data);
        console.log("🎯 EXITTIME: Dados originais:", data);
        console.log("🎯 EXITTIME: Dados limpos:", cleanedData);
        return originalSetDoc(docRef, cleanedData, options);
      };
    }

    // Interceptar addDoc global
    if (typeof addDoc !== "undefined") {
      const originalAddDoc = addDoc;
      window.addDoc = function (collectionRef, data) {
        console.log("🎯 EXITTIME: addDoc interceptado");
        const cleanedData = cleanExitTimeFields(data);
        console.log("🎯 EXITTIME: Dados limpos:", cleanedData);
        return originalAddDoc(collectionRef, cleanedData);
      };
    }

    // Interceptar updateDoc global
    if (typeof updateDoc !== "undefined") {
      const originalUpdateDoc = updateDoc;
      window.updateDoc = function (docRef, data) {
        console.log("🎯 EXITTIME: updateDoc interceptado");
        const cleanedData = cleanExitTimeFields(data);
        console.log("🎯 EXITTIME: Dados limpos:", cleanedData);
        return originalUpdateDoc(docRef, cleanedData);
      };
    }

    // Interceptar Firebase SDK se disponível
    if (window.firebase && window.firebase.firestore) {
      try {
        const firestore = window.firebase.firestore();

        // Interceptar métodos da instância do Firestore
        const originalDoc = firestore.doc;
        firestore.doc = function (path) {
          const docRef = originalDoc.call(this, path);

          // Interceptar set do documento
          const originalSet = docRef.set;
          docRef.set = function (data, options) {
            console.log("🎯 EXITTIME: docRef.set interceptado");
            const cleanedData = cleanExitTimeFields(data);
            console.log("🎯 EXITTIME: Dados limpos:", cleanedData);
            return originalSet.call(this, cleanedData, options);
          };

          // Interceptar update do documento
          const originalUpdate = docRef.update;
          docRef.update = function (data) {
            console.log("🎯 EXITTIME: docRef.update interceptado");
            const cleanedData = cleanExitTimeFields(data);
            console.log("🎯 EXITTIME: Dados limpos:", cleanedData);
            return originalUpdate.call(this, cleanedData);
          };

          return docRef;
        };

        // Interceptar collection().add()
        const originalCollection = firestore.collection;
        firestore.collection = function (path) {
          const collection = originalCollection.call(this, path);

          const originalAdd = collection.add;
          collection.add = function (data) {
            console.log("🎯 EXITTIME: collection.add interceptado");
            const cleanedData = cleanExitTimeFields(data);
            console.log("🎯 EXITTIME: Dados limpos:", cleanedData);
            return originalAdd.call(this, cleanedData);
          };

          return collection;
        };

        console.log("🎯 EXITTIME: Firebase SDK interceptado");
      } catch (e) {
        console.error("🎯 EXITTIME: Erro ao interceptar Firebase SDK:", e);
      }
    }
  }

  // Monitor para interceptar Firebase quando carregar
  function monitorFirebase() {
    let attempts = 0;
    const monitor = setInterval(() => {
      attempts++;

      setupFirebaseInterception();

      // Parar após 60 tentativas (30 segundos)
      if (attempts > 60) {
        clearInterval(monitor);
        console.log("🎯 EXITTIME: Monitor Firebase finalizado");
      }
    }, 500);
  }

  // Interceptar requests HTTP diretamente
  function interceptHTTPRequests() {
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
      if (
        typeof url === "string" &&
        (url.includes("firestore") || url.includes("firebase")) &&
        options &&
        options.body
      ) {
        try {
          let body = options.body;
          if (typeof body === "string") {
            // Tentar encontrar e limpar exitTime no JSON
            if (body.includes("exitTime") && body.includes("undefined")) {
              console.log(
                "🎯 EXITTIME: Fetch com exitTime undefined detectado",
              );

              // Remover referências a exitTime undefined
              body = body.replace(/"exitTime":\s*undefined/g, "");
              body = body.replace(/"exitTime":\s*null/g, "");
              body = body.replace(/,\s*"exitTime":\s*""/g, "");
              body = body.replace(/"exitTime":\s*"",/g, "");

              options.body = body;
              console.log("🎯 EXITTIME: Fetch body limpo");
            }
          }
        } catch (e) {
          console.error("🎯 EXITTIME: Erro ao limpar fetch body:", e);
        }
      }

      return originalFetch.apply(this, arguments);
    };
  }

  // Inicializar todas as interceptações
  function init() {
    setupFirebaseInterception();
    monitorFirebase();
    interceptHTTPRequests();

    console.log("🎯 EXITTIME FIX: Todas as interceptações ativas");
  }

  // Executar imediatamente
  init();

  // Executar novamente após delays
  setTimeout(init, 1000);
  setTimeout(init, 3000);
  setTimeout(init, 5000);
})();
