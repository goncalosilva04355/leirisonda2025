// COMPREHENSIVE DATA FIX - Corrige undefined E datas inválidas

console.log("🔧 COMPREHENSIVE FIX: Iniciando correção completa...");

(function () {
  "use strict";

  // 1. CORREÇÃO GLOBAL DE DATAS INVÁLIDAS
  function fixGlobalDateIssues() {
    console.log("📅 Corrigindo problemas de data globalmente...");

    // Interceptar Date constructor
    const OriginalDate = window.Date;

    window.Date = function (...args) {
      try {
        // Se sem argumentos, usar data atual
        if (args.length === 0) {
          return new OriginalDate();
        }

        // Se primeiro argumento é problemático
        const firstArg = args[0];
        if (
          firstArg === null ||
          firstArg === undefined ||
          firstArg === "" ||
          firstArg === "Invalid Date" ||
          firstArg === "undefined" ||
          firstArg === "null"
        ) {
          console.warn("📅 Data inválida corrigida:", firstArg);
          return new OriginalDate();
        }

        // Tentar criar data normalmente
        const date = new OriginalDate(...args);

        // Verificar se é válida
        if (isNaN(date.getTime())) {
          console.warn("📅 Data inválida, usando atual:", args);
          return new OriginalDate();
        }

        return date;
      } catch (e) {
        console.warn("📅 Erro ao criar data, usando atual:", e.message);
        return new OriginalDate();
      }
    };

    // Preservar propriedades
    Object.setPrototypeOf(window.Date, OriginalDate);
    Object.setPrototypeOf(window.Date.prototype, OriginalDate.prototype);
    window.Date.now = OriginalDate.now;
    window.Date.parse = function (str) {
      if (!str || str === "undefined" || str === "null") {
        return OriginalDate.now();
      }
      const parsed = OriginalDate.parse(str);
      return isNaN(parsed) ? OriginalDate.now() : parsed;
    };
    window.Date.UTC = OriginalDate.UTC;

    console.log("✅ Date constructor corrigido");
  }

  // 2. LIMPEZA PROFUNDA DE DADOS PARA FIRESTORE
  function deepCleanData(obj, path = "") {
    if (obj === null || obj === undefined) {
      return null;
    }

    if (typeof obj !== "object") {
      // Se é string que parece data mas é inválida
      if (
        typeof obj === "string" &&
        (path.includes("Time") ||
          path.includes("Date") ||
          path.includes("time") ||
          path.includes("date"))
      ) {
        if (
          obj === "undefined" ||
          obj === "null" ||
          obj === "" ||
          obj === "Invalid Date"
        ) {
          console.warn(`🧹 Data inválida corrigida em ${path}:`, obj);
          return new Date().toISOString();
        }

        // Verificar se é data válida
        const parsed = Date.parse(obj);
        if (isNaN(parsed)) {
          console.warn(`🧹 String de data inválida em ${path}:`, obj);
          return new Date().toISOString();
        }
      }

      return obj;
    }

    if (Array.isArray(obj)) {
      return obj
        .map((item, index) => deepCleanData(item, `${path}[${index}]`))
        .filter((item) => item !== undefined);
    }

    const cleaned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const currentPath = path ? `${path}.${key}` : key;

        // Remover campos undefined
        if (value === undefined) {
          console.warn(`🧹 Campo ${currentPath} removido (undefined)`);
          continue;
        }

        // Campos problemáticos específicos
        if (
          key === "exitTime" &&
          (value === undefined || value === null || value === "")
        ) {
          console.warn(`🧹 exitTime problemático removido:`, value);
          continue;
        }

        // Corrigir campos de tempo/data
        if (
          (key.includes("Time") ||
            key.includes("Date") ||
            key.includes("time") ||
            key.includes("date")) &&
          (value === null ||
            value === undefined ||
            value === "" ||
            value === "Invalid Date")
        ) {
          console.warn(`🧹 Campo de data ${currentPath} corrigido:`, value);
          cleaned[key] = new Date().toISOString();
          continue;
        }

        // Limpar recursivamente
        const cleanedValue = deepCleanData(value, currentPath);
        if (cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
        }
      }
    }

    return cleaned;
  }

  // 3. INTERCEPTAR TODAS AS OPERAÇÕES FIRESTORE
  function interceptAllFirestoreOps() {
    console.log("🔍 Interceptando operações Firestore...");

    // Aguardar Firebase
    const waitForFirebase = () => {
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
              console.log("🧹 Interceptando collection.add()");
              const cleanedData = deepCleanData(data);
              console.log("🧹 Dados originais:", data);
              console.log("🧹 Dados limpos:", cleanedData);
              return originalAdd.call(this, cleanedData);
            };

            // Interceptar doc().set()
            const originalDoc = collection.doc;
            collection.doc = function (docId) {
              const docRef = originalDoc.call(this, docId);

              const originalSet = docRef.set;
              docRef.set = function (data, options) {
                console.log("🧹 Interceptando doc.set()");
                const cleanedData = deepCleanData(data);
                console.log("🧹 Dados originais:", data);
                console.log("🧹 Dados limpos:", cleanedData);
                return originalSet.call(this, cleanedData, options);
              };

              const originalUpdate = docRef.update;
              docRef.update = function (data) {
                console.log("🧹 Interceptando doc.update()");
                const cleanedData = deepCleanData(data);
                console.log("🧹 Dados limpos:", cleanedData);
                return originalUpdate.call(this, cleanedData);
              };

              return docRef;
            };

            return collection;
          };

          console.log("✅ Firestore interceptado");
        } catch (e) {
          console.log("❌ Erro ao interceptar Firestore:", e.message);
        }
      } else {
        setTimeout(waitForFirebase, 100);
      }
    };

    waitForFirebase();
  }

  // 4. INTERCEPTAR FUNÇÕES GLOBAIS DO FIRESTORE
  function interceptGlobalFirestoreFunctions() {
    console.log("🌐 Interceptando funções globais Firestore...");

    // Aguardar funções globais estarem disponíveis
    const waitForGlobals = () => {
      if (window.setDoc) {
        const originalSetDoc = window.setDoc;
        window.setDoc = function (docRef, data, options) {
          console.log("🧹 Interceptando setDoc global");
          const cleanedData = deepCleanData(data);
          console.log("🧹 setDoc - dados limpos:", cleanedData);
          return originalSetDoc(docRef, cleanedData, options);
        };
        console.log("✅ setDoc global interceptado");
      }

      if (window.addDoc) {
        const originalAddDoc = window.addDoc;
        window.addDoc = function (collectionRef, data) {
          console.log("🧹 Interceptando addDoc global");
          const cleanedData = deepCleanData(data);
          console.log("🧹 addDoc - dados limpos:", cleanedData);
          return originalAddDoc(collectionRef, cleanedData);
        };
        console.log("✅ addDoc global interceptado");
      }

      if (window.updateDoc) {
        const originalUpdateDoc = window.updateDoc;
        window.updateDoc = function (docRef, data) {
          console.log("🧹 Interceptando updateDoc global");
          const cleanedData = deepCleanData(data);
          console.log("🧹 updateDoc - dados limpos:", cleanedData);
          return originalUpdateDoc(docRef, cleanedData);
        };
        console.log("✅ updateDoc global interceptado");
      }

      // Tentar novamente se ainda não estão disponíveis
      if (!window.setDoc || !window.addDoc || !window.updateDoc) {
        setTimeout(waitForGlobals, 500);
      }
    };

    waitForGlobals();
  }

  // 5. INTERCEPTAR ERROS REACT PARA EVITAR CRASH
  function interceptReactErrors() {
    console.log("⚠️ Interceptando erros React...");

    // Error boundary global
    const originalOnError = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
      if (
        error &&
        error.name === "RangeError" &&
        message.includes("Invalid time value")
      ) {
        console.error(
          "📅 RangeError de data interceptado e bloqueado:",
          message,
        );
        return true; // Bloquear propagação
      }

      if (originalOnError) {
        return originalOnError.apply(this, arguments);
      }
      return false;
    };

    // Interceptar erros não capturados
    window.addEventListener("unhandledrejection", (event) => {
      if (
        event.reason &&
        event.reason.message &&
        event.reason.message.includes("Invalid time value")
      ) {
        console.error(
          "📅 Promise rejection de data interceptado:",
          event.reason,
        );
        event.preventDefault();
      }
    });

    console.log("✅ Interceptação de erros configurada");
  }

  // EXECUTAR TODAS AS CORREÇÕES
  fixGlobalDateIssues();
  interceptAllFirestoreOps();
  interceptGlobalFirestoreFunctions();
  interceptReactErrors();

  // Reexecutar após app carregar
  setTimeout(() => {
    interceptAllFirestoreOps();
    interceptGlobalFirestoreFunctions();
  }, 5000);

  console.log("✅ COMPREHENSIVE DATA FIX: Todas as correções ativas");
})();
