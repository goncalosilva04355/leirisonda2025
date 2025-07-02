// SIMPLE SETDOC FIX - Intercepta apenas setDoc para converter Date objects

console.log("📝 SETDOC FIX: Iniciando interceptação simples...");

// Função para converter apenas Date objects para string ISO
function simpleDateConvert(obj) {
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(simpleDateConvert);
  }

  if (obj && typeof obj === "object") {
    const converted = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        converted[key] = simpleDateConvert(obj[key]);
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
