// AGGRESSIVE DATE FIX - Intercepta TODOS os Date objects para Firestore

console.log("🚨 AGGRESSIVE DATE FIX: Iniciando interceptação total...");

(function () {
  "use strict";

  // Função para converter recursivamente TODOS os Date objects
  function convertAllDates(obj, depth = 0) {
    // Evitar recursão infinita
    if (depth > 10) return obj;

    if (obj === null || obj === undefined) {
      return obj;
    }

    // Se é Date object, converter SEMPRE
    if (obj instanceof Date) {
      console.warn("🚨 DATE CONVERTIDO:", obj);
      // Tentar usar Firestore Timestamp se disponível
      try {
        if (
          window.firebase &&
          window.firebase.firestore &&
          window.firebase.firestore.Timestamp
        ) {
          return window.firebase.firestore.Timestamp.fromDate(obj);
        }
      } catch (e) {
        console.warn("Fallback para ISO string:", e.message);
      }
      // Fallback para ISO string
      return obj.toISOString();
    }

    // Se é array
    if (Array.isArray(obj)) {
      return obj.map((item) => convertAllDates(item, depth + 1));
    }

    // Se é objeto
    if (typeof obj === "object") {
      const converted = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          converted[key] = convertAllDates(obj[key], depth + 1);
        }
      }
      return converted;
    }

    return obj;
  }

  // INTERCEPTAR TODAS AS FUNÇÕES FIRESTORE A NÍVEL GLOBAL
  function interceptEverything() {
    console.log("🚨 Interceptando TUDO relacionado a Firestore...");

    // Override JSON.stringify para converter antes de serializar
    const originalStringify = JSON.stringify;
    JSON.stringify = function (value, replacer, space) {
      const convertedValue = convertAllDates(value);
      return originalStringify.call(this, convertedValue, replacer, space);
    };

    // Override fetch completamente
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
      if (typeof url === "string" && url.includes("firestore")) {
        console.log("🚨 FIRESTORE FETCH INTERCEPTADO:", url);

        if (options && options.body) {
          try {
            // Se é string JSON, parsear e converter
            if (typeof options.body === "string") {
              const parsedBody = JSON.parse(options.body);
              const convertedBody = convertAllDates(parsedBody);
              options.body = JSON.stringify(convertedBody);
              console.log("🚨 BODY CONVERTIDO:", convertedBody);
            }
          } catch (e) {
            console.log("Erro ao converter body:", e.message);
          }
        }
      }

      return originalFetch.apply(this, arguments);
    };

    // Aguardar Firebase e interceptar TODAS as funções
    const waitAndIntercept = () => {
      if (window.firebase && window.firebase.firestore) {
        try {
          const firestore = window.firebase.firestore();

          // Override collection de forma mais agressiva
          const originalCollection = firestore.collection;
          firestore.collection = function (...args) {
            const collection = originalCollection.apply(this, args);

            // Override TODAS as funções de escrita
            ["add", "set", "update"].forEach((method) => {
              if (collection[method]) {
                const originalMethod = collection[method];
                collection[method] = function (data, ...otherArgs) {
                  console.log(`🚨 ${method.toUpperCase()} INTERCEPTADO`);
                  const convertedData = convertAllDates(data);
                  console.log("🚨 DADOS ORIGINAIS:", data);
                  console.log("🚨 DADOS CONVERTIDOS:", convertedData);
                  return originalMethod.call(this, convertedData, ...otherArgs);
                };
              }
            });

            // Override doc também
            if (collection.doc) {
              const originalDoc = collection.doc;
              collection.doc = function (...args) {
                const doc = originalDoc.apply(this, args);

                ["set", "update"].forEach((method) => {
                  if (doc[method]) {
                    const originalMethod = doc[method];
                    doc[method] = function (data, ...otherArgs) {
                      console.log(
                        `🚨 DOC.${method.toUpperCase()} INTERCEPTADO`,
                      );
                      const convertedData = convertAllDates(data);
                      console.log("🚨 DADOS ORIGINAIS:", data);
                      console.log("🚨 DADOS CONVERTIDOS:", convertedData);
                      return originalMethod.call(
                        this,
                        convertedData,
                        ...otherArgs,
                      );
                    };
                  }
                });

                return doc;
              };
            }

            return collection;
          };

          console.log("✅ Firestore completamente interceptado");
        } catch (e) {
          console.log("❌ Erro ao interceptar Firestore:", e.message);
        }
      }

      // Interceptar funções globais também
      ["setDoc", "addDoc", "updateDoc"].forEach((funcName) => {
        if (window[funcName]) {
          const originalFunc = window[funcName];
          window[funcName] = function (ref, data, ...args) {
            console.log(`🚨 ${funcName.toUpperCase()} GLOBAL INTERCEPTADO`);
            const convertedData = convertAllDates(data);
            console.log("🚨 DADOS ORIGINAIS:", data);
            console.log("🚨 DADOS CONVERTIDOS:", convertedData);
            return originalFunc.call(this, ref, convertedData, ...args);
          };
          console.log(`✅ ${funcName} global interceptado`);
        }
      });
    };

    // Tentar imediatamente
    waitAndIntercept();

    // Tentar múltiplas vezes
    [1000, 2000, 3000, 5000].forEach((delay) => {
      setTimeout(waitAndIntercept, delay);
    });
  }

  // OVERRIDE DE Date.prototype.toJSON para forçar Timestamp
  Date.prototype.toJSON = function () {
    console.warn("🚨 Date.toJSON() interceptado:", this);

    // Se Firestore Timestamp está disponível, usar
    try {
      if (
        window.firebase &&
        window.firebase.firestore &&
        window.firebase.firestore.Timestamp
      ) {
        return window.firebase.firestore.Timestamp.fromDate(this);
      }
    } catch (e) {}

    // Fallback para ISO string
    return this.toISOString();
  };

  // Executar tudo
  interceptEverything();

  console.log("✅ AGGRESSIVE DATE FIX: Sistema ultra-agressivo ativo");
})();
