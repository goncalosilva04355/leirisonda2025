// SIMPLE SETDOC FIX - Intercepta apenas setDoc para converter Date objects

console.log("📝 SETDOC FIX: Iniciando interceptação simples...");

// Função para converter Date objects E remover undefined
function simpleDateConvert(obj) {
  if (obj === undefined || obj === null) {
    return null; // Convert undefined to null
  }

  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(simpleDateConvert).filter((item) => item !== undefined);
  }

  if (obj && typeof obj === "object") {
    const converted = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        // Skip undefined fields completely
        if (value === undefined) {
          console.warn(`📝 SETDOC: Campo ${key} removido (undefined)`);
          continue;
        }

        // Handle problematic exitTime specifically
        if (
          key === "exitTime" &&
          (value === undefined || value === null || value === "")
        ) {
          console.warn(`📝 SETDOC: exitTime problemático removido:`, value);
          continue;
        }

        const convertedValue = simpleDateConvert(value);
        if (convertedValue !== undefined) {
          converted[key] = convertedValue;
        }
      }
    }
    return converted;
  }

  return obj;
}

// Aguardar setDoc global estar disponível
function waitForSetDoc() {
  if (window.setDoc) {
    console.log("📝 setDoc encontrado - interceptando...");

    const originalSetDoc = window.setDoc;
    window.setDoc = function (docRef, data, options) {
      console.log("📝 SETDOC INTERCEPTADO!");
      console.log("📝 Dados originais:", data);

      const convertedData = simpleDateConvert(data);
      console.log("📝 Dados convertidos:", convertedData);

      return originalSetDoc(docRef, convertedData, options);
    };

    console.log("✅ setDoc interceptado com sucesso");
  } else {
    setTimeout(waitForSetDoc, 100);
  }
}

// Iniciar interceptação
waitForSetDoc();

// Tentar múltiplas vezes
setTimeout(waitForSetDoc, 1000);
setTimeout(waitForSetDoc, 3000);
setTimeout(waitForSetDoc, 5000);

console.log("📝 SETDOC FIX: Aguardando setDoc...");
