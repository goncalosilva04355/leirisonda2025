// DIRECT EXITTIME INTERCEPTOR - Interceptação direta no código minificado

console.log(
  "🎯 DIRECT INTERCEPTOR: Iniciando interceptação direta de exitTime...",
);

(function () {
  "use strict";

  // Função para limpar exitTime do objeto
  function cleanExitTime(obj) {
    if (!obj || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => cleanExitTime(item));
    }

    const cleaned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === "exitTime" && obj[key] === undefined) {
          console.warn("🎯 DIRECT: exitTime undefined removido");
          continue; // Não incluir este campo
        }
        cleaned[key] = obj[key];
      }
    }
    return cleaned;
  }

  // Interceptar ANTES do Firebase carregar
  let firestoreIntercepted = false;

  // Interceptar o objeto window para capturar Firebase assim que carregar
  Object.defineProperty(window, "firebase", {
    get: function () {
      return this._firebase;
    },
    set: function (value) {
      this._firebase = value;

      if (value && value.firestore && !firestoreIntercepted) {
        setTimeout(() => {
          interceptFirebaseDirectly();
        }, 100);
      }
    },
    configurable: true,
  });

  function interceptFirebaseDirectly() {
    if (firestoreIntercepted) return;
    firestoreIntercepted = true;

    console.log("🎯 DIRECT: Interceptando Firebase diretamente...");

    try {
      const firestore = window.firebase.firestore();

      // Interceptar getFirestore se disponível
      if (window.getFirestore) {
        const originalGetFirestore = window.getFirestore;
        window.getFirestore = function () {
          const fs = originalGetFirestore.apply(this, arguments);
          interceptFirestoreInstance(fs);
          return fs;
        };
      }

      interceptFirestoreInstance(firestore);
    } catch (e) {
      console.error("🎯 DIRECT: Erro ao interceptar Firebase:", e);
    }
  }

  function interceptFirestoreInstance(firestore) {
    if (!firestore) return;

    // Interceptar doc() para capturar documentos
    const originalDoc = firestore.doc;
    firestore.doc = function (path) {
      const docRef = originalDoc.call(this, path);

      // Interceptar set() do documento
      if (docRef.set) {
        const originalSet = docRef.set;
        docRef.set = function (data, options) {
          console.log("🎯 DIRECT: doc.set interceptado para", path);

          // Verificar se é uma obra (tem workSheetNumber)
          if (data && (data.workSheetNumber || data.clientName)) {
            console.log("🎯 DIRECT: Obra detectada, limpando exitTime");
            data = cleanExitTime(data);
          }

          return originalSet.call(this, data, options);
        };
      }

      // Interceptar update() do documento
      if (docRef.update) {
        const originalUpdate = docRef.update;
        docRef.update = function (data) {
          console.log("🎯 DIRECT: doc.update interceptado para", path);
          data = cleanExitTime(data);
          return originalUpdate.call(this, data);
        };
      }

      return docRef;
    };

    // Interceptar collection()
    const originalCollection = firestore.collection;
    firestore.collection = function (path) {
      const collection = originalCollection.call(this, path);

      // Interceptar add() da collection
      if (collection.add) {
        const originalAdd = collection.add;
        collection.add = function (data) {
          console.log("🎯 DIRECT: collection.add interceptado para", path);

          if (data && (data.workSheetNumber || data.clientName)) {
            console.log(
              "🎯 DIRECT: Obra detectada na collection, limpando exitTime",
            );
            data = cleanExitTime(data);
          }

          return originalAdd.call(this, data);
        };
      }

      return collection;
    };

    console.log("🎯 DIRECT: Firestore instance interceptado");
  }

  // Interceptar funções globais setDoc/addDoc/updateDoc
  function interceptGlobalFunctions() {
    // setDoc global
    if (typeof setDoc !== "undefined") {
      const original = setDoc;
      window.setDoc = function (docRef, data, options) {
        console.log("🎯 DIRECT: setDoc global interceptado");

        if (data && typeof data === "object") {
          // Verificar se contém exitTime undefined
          if ("exitTime" in data && data.exitTime === undefined) {
            console.warn(
              "🎯 DIRECT: exitTime undefined encontrado em setDoc, removendo",
            );
            data = cleanExitTime(data);
          }
        }

        return original(docRef, data, options);
      };
      console.log("🎯 DIRECT: setDoc global interceptado");
    }

    // addDoc global
    if (typeof addDoc !== "undefined") {
      const original = addDoc;
      window.addDoc = function (collectionRef, data) {
        console.log("🎯 DIRECT: addDoc global interceptado");

        if (
          data &&
          typeof data === "object" &&
          "exitTime" in data &&
          data.exitTime === undefined
        ) {
          console.warn(
            "🎯 DIRECT: exitTime undefined encontrado em addDoc, removendo",
          );
          data = cleanExitTime(data);
        }

        return original(collectionRef, data);
      };
      console.log("🎯 DIRECT: addDoc global interceptado");
    }

    // updateDoc global
    if (typeof updateDoc !== "undefined") {
      const original = updateDoc;
      window.updateDoc = function (docRef, data) {
        console.log("🎯 DIRECT: updateDoc global interceptado");

        if (
          data &&
          typeof data === "object" &&
          "exitTime" in data &&
          data.exitTime === undefined
        ) {
          console.warn(
            "🎯 DIRECT: exitTime undefined encontrado em updateDoc, removendo",
          );
          data = cleanExitTime(data);
        }

        return original(docRef, data);
      };
      console.log("🎯 DIRECT: updateDoc global interceptado");
    }
  }

  // Interceptar diretamente variáveis globais do Firebase v9
  function interceptFirebaseV9() {
    // Verificar se temos módulos Firebase v9
    const checkAndIntercept = () => {
      if (window.setDoc || window.addDoc || window.updateDoc) {
        interceptGlobalFunctions();
      }

      // Verificar objetos Firebase comuns
      if (window.firebase) {
        interceptFirebaseDirectly();
      }
    };

    // Executar múltiplas vezes
    checkAndIntercept();
    setTimeout(checkAndIntercept, 500);
    setTimeout(checkAndIntercept, 1000);
    setTimeout(checkAndIntercept, 2000);
    setTimeout(checkAndIntercept, 5000);
  }

  // Interceptar via prototype se necessário
  function interceptViaPrototype() {
    // Se o Firebase já estiver carregado mas não interceptado
    setTimeout(() => {
      if (
        window.firebase &&
        window.firebase.firestore &&
        !firestoreIntercepted
      ) {
        console.log("🎯 DIRECT: Tentando interceptação via prototype...");

        try {
          const firestore = window.firebase.firestore();
          const firestoreProto = Object.getPrototypeOf(firestore);

          if (firestoreProto && firestoreProto.doc) {
            const originalDoc = firestoreProto.doc;
            firestoreProto.doc = function (path) {
              const docRef = originalDoc.call(this, path);

              if (docRef && docRef.set) {
                const originalSet = docRef.set;
                docRef.set = function (data, options) {
                  if (
                    data &&
                    "exitTime" in data &&
                    data.exitTime === undefined
                  ) {
                    console.warn("🎯 DIRECT: exitTime removido via prototype");
                    data = cleanExitTime(data);
                  }
                  return originalSet.call(this, data, options);
                };
              }

              return docRef;
            };

            console.log("🎯 DIRECT: Prototype interceptado");
          }
        } catch (e) {
          console.error("🎯 DIRECT: Erro na interceptação via prototype:", e);
        }
      }
    }, 3000);
  }

  // Método extremo: Interceptar Object.defineProperty para capturar Firebase
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function (obj, prop, descriptor) {
    const result = originalDefineProperty.call(this, obj, prop, descriptor);

    // Se alguém estiver definindo propriedades relacionadas ao Firebase
    if (prop === "firebase" || (obj === window && prop === "setDoc")) {
      setTimeout(() => {
        interceptFirebaseV9();
      }, 100);
    }

    return result;
  };

  // Inicializar todas as estratégias
  function init() {
    interceptFirebaseV9();
    interceptViaPrototype();

    console.log("🎯 DIRECT INTERCEPTOR: Todas as estratégias ativas");
  }

  // Executar imediatamente e em delays
  init();
  setTimeout(init, 1000);
  setTimeout(init, 3000);
  setTimeout(init, 5000);
})();
