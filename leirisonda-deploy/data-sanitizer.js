// DATA SANITIZER - Sanitização completa de dados na origem

console.log("🧼 SANITIZER: Iniciando sanitização completa de dados...");

(function () {
  "use strict";

  // Função para sanitizar datas
  function sanitizeDate(value, fieldName) {
    if (value === undefined || value === null || value === "") {
      console.warn(`🧼 SANITIZER: Data ${fieldName} removida (${value})`);
      return undefined; // Será removido pelo sanitizador de undefined
    }

    if (value instanceof Date) {
      if (isNaN(value.getTime())) {
        console.warn(`🧼 SANITIZER: Data inválida ${fieldName} corrigida`);
        return new Date().toISOString();
      }
      return value.toISOString();
    }

    if (typeof value === "string") {
      const parsed = new Date(value);
      if (isNaN(parsed.getTime())) {
        console.warn(
          `🧼 SANITIZER: String de data inválida ${fieldName} corrigida: ${value}`,
        );
        return new Date().toISOString();
      }
      return value;
    }

    return value;
  }

  // Função principal de sanitização
  function sanitizeData(obj, path = "") {
    if (obj === null || obj === undefined) {
      return null;
    }

    if (Array.isArray(obj)) {
      return obj
        .map((item, index) => sanitizeData(item, `${path}[${index}]`))
        .filter((item) => item !== undefined);
    }

    if (typeof obj === "object") {
      const sanitized = {};

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          const currentPath = path ? `${path}.${key}` : key;

          // REMOVER CAMPOS UNDEFINED/NULL PROBLEMÁTICOS
          if (value === undefined) {
            console.warn(
              `🧼 SANITIZER: Campo ${currentPath} removido (undefined)`,
            );
            continue;
          }

          // TRATAR ESPECIFICAMENTE exitTime
          if (key === "exitTime") {
            if (value === undefined || value === null || value === "") {
              console.warn(`🧼 SANITIZER: exitTime removido (${value})`);
              continue; // NÃO incluir o campo
            }
          }

          // TRATAR CAMPOS DE DATA/TEMPO
          if (
            key.includes("Time") ||
            key.includes("Date") ||
            key.includes("time") ||
            key.includes("date") ||
            key.includes("At") ||
            key.includes("Created") ||
            key.includes("Updated")
          ) {
            const sanitizedDate = sanitizeDate(value, currentPath);
            if (sanitizedDate !== undefined) {
              sanitized[key] = sanitizedDate;
            }
            continue;
          }

          // TRATAR CAMPOS ESPECÍFICOS PROBLEMÁTICOS
          if (
            key === "entryTime" ||
            key === "createdAt" ||
            key === "updatedAt"
          ) {
            const sanitizedDate = sanitizeDate(value, currentPath);
            if (sanitizedDate !== undefined) {
              sanitized[key] = sanitizedDate;
            } else {
              // Se não conseguir sanitizar, usar data atual
              sanitized[key] = new Date().toISOString();
            }
            continue;
          }

          // Processar recursivamente outros campos
          const sanitizedValue = sanitizeData(value, currentPath);
          if (sanitizedValue !== undefined) {
            sanitized[key] = sanitizedValue;
          }
        }
      }

      return sanitized;
    }

    return obj;
  }

  // Interceptar JSON.stringify para capturar dados antes de serem serializados
  const originalStringify = JSON.stringify;
  JSON.stringify = function (value, replacer, space) {
    if (value && typeof value === "object") {
      // Verificar se contém dados de obra
      if (
        value.workSheetNumber ||
        value.clientName ||
        (Array.isArray(value) &&
          value.some((item) => item && item.workSheetNumber))
      ) {
        console.log(
          "🧼 SANITIZER: JSON.stringify interceptado para dados de obra",
        );
        const sanitized = sanitizeData(value);
        console.log("🧼 SANITIZER: Dados sanitizados:", sanitized);
        return originalStringify.call(this, sanitized, replacer, space);
      }
    }

    return originalStringify.call(this, value, replacer, space);
  };

  // Interceptar localStorage para obras
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    if (key === "works" || key === "leirisonda_works" || key.includes("work")) {
      try {
        const data = JSON.parse(value);
        const sanitized = sanitizeData(data);
        const sanitizedValue = JSON.stringify(sanitized);

        if (sanitizedValue !== value) {
          console.log(`🧼 SANITIZER: localStorage ${key} sanitizado`);
        }

        return originalSetItem.call(this, key, sanitizedValue);
      } catch (e) {
        console.error("🧼 SANITIZER: Erro ao sanitizar localStorage:", e);
        return originalSetItem.call(this, key, value);
      }
    }

    return originalSetItem.call(this, key, value);
  };

  // Interceptar todas as funções Firebase
  function interceptFirebase() {
    // setDoc
    if (typeof setDoc !== "undefined") {
      const original = setDoc;
      window.setDoc = function (docRef, data, options) {
        console.log("🧼 SANITIZER: setDoc interceptado");
        const sanitized = sanitizeData(data);
        console.log("🧼 SANITIZER: Original:", data);
        console.log("🧼 SANITIZER: Sanitizado:", sanitized);
        return original(docRef, sanitized, options);
      };
    }

    // addDoc
    if (typeof addDoc !== "undefined") {
      const original = addDoc;
      window.addDoc = function (collectionRef, data) {
        console.log("🧼 SANITIZER: addDoc interceptado");
        const sanitized = sanitizeData(data);
        console.log("🧼 SANITIZER: Dados sanitizados:", sanitized);
        return original(collectionRef, sanitized);
      };
    }

    // updateDoc
    if (typeof updateDoc !== "undefined") {
      const original = updateDoc;
      window.updateDoc = function (docRef, data) {
        console.log("🧼 SANITIZER: updateDoc interceptado");
        const sanitized = sanitizeData(data);
        console.log("🧼 SANITIZER: Dados sanitizados:", sanitized);
        return original(docRef, sanitized);
      };
    }

    // Firebase SDK
    if (window.firebase && window.firebase.firestore) {
      try {
        const firestore = window.firebase.firestore();

        // Interceptar doc().set()
        const originalDoc = firestore.doc;
        firestore.doc = function (path) {
          const docRef = originalDoc.call(this, path);

          const originalSet = docRef.set;
          docRef.set = function (data, options) {
            console.log("🧼 SANITIZER: Firebase doc.set interceptado");
            const sanitized = sanitizeData(data);
            console.log("🧼 SANITIZER: Dados sanitizados:", sanitized);
            return originalSet.call(this, sanitized, options);
          };

          const originalUpdate = docRef.update;
          docRef.update = function (data) {
            console.log("🧼 SANITIZER: Firebase doc.update interceptado");
            const sanitized = sanitizeData(data);
            return originalUpdate.call(this, sanitized);
          };

          return docRef;
        };

        // Interceptar collection().add()
        const originalCollection = firestore.collection;
        firestore.collection = function (path) {
          const collection = originalCollection.call(this, path);

          const originalAdd = collection.add;
          collection.add = function (data) {
            console.log("🧼 SANITIZER: Firebase collection.add interceptado");
            const sanitized = sanitizeData(data);
            console.log("🧼 SANITIZER: Dados sanitizados:", sanitized);
            return originalAdd.call(this, sanitized);
          };

          return collection;
        };

        console.log("🧼 SANITIZER: Firebase SDK interceptado");
      } catch (e) {
        console.error("🧼 SANITIZER: Erro ao interceptar Firebase:", e);
      }
    }
  }

  // Interceptar fetch para Firestore
  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    if (
      typeof url === "string" &&
      url.includes("firestore") &&
      options &&
      options.body
    ) {
      try {
        const body = options.body;
        if (
          typeof body === "string" &&
          (body.includes("exitTime") || body.includes("Time"))
        ) {
          console.log("🧼 SANITIZER: Fetch para Firestore interceptado");

          // Tentar sanitizar o body
          const parsed = JSON.parse(body);
          const sanitized = sanitizeData(parsed);
          options.body = JSON.stringify(sanitized);

          console.log("🧼 SANITIZER: Fetch body sanitizado");
        }
      } catch (e) {
        // Ignorar erros de parsing
      }
    }

    return originalFetch.apply(this, arguments);
  };

  // Interceptar erros de data para prevenir crashes
  const originalDateConstructor = Date;
  window.Date = function (...args) {
    try {
      if (args.length === 0) {
        return new originalDateConstructor();
      }

      const firstArg = args[0];
      if (
        firstArg === null ||
        firstArg === undefined ||
        firstArg === "" ||
        firstArg === "undefined" ||
        firstArg === "null"
      ) {
        console.warn(
          "🧼 SANITIZER: Data inválida substituída por data atual:",
          firstArg,
        );
        return new originalDateConstructor();
      }

      const date = new originalDateConstructor(...args);
      if (isNaN(date.getTime())) {
        console.warn("🧼 SANITIZER: Data inválida, usando data atual:", args);
        return new originalDateConstructor();
      }

      return date;
    } catch (e) {
      console.warn("🧼 SANITIZER: Erro ao criar data, usando atual:", e);
      return new originalDateConstructor();
    }
  };

  // Preservar propriedades do Date
  Object.setPrototypeOf(window.Date, originalDateConstructor);
  Object.setPrototypeOf(
    window.Date.prototype,
    originalDateConstructor.prototype,
  );
  window.Date.now = originalDateConstructor.now;
  window.Date.parse = function (str) {
    if (!str || str === "undefined" || str === "null" || str === "") {
      return originalDateConstructor.now();
    }
    const parsed = originalDateConstructor.parse(str);
    return isNaN(parsed) ? originalDateConstructor.now() : parsed;
  };
  window.Date.UTC = originalDateConstructor.UTC;

  // Monitor Firebase
  function monitorFirebase() {
    let attempts = 0;
    const monitor = setInterval(() => {
      attempts++;
      interceptFirebase();

      if (attempts > 120) {
        // 60 segundos
        clearInterval(monitor);
      }
    }, 500);
  }

  // Inicializar
  function init() {
    interceptFirebase();
    monitorFirebase();
    console.log("🧼 SANITIZER: Sistema completo de sanitização ativo");
  }

  // Executar imediatamente e em intervalos
  init();
  setTimeout(init, 1000);
  setTimeout(init, 3000);
  setTimeout(init, 5000);
})();
