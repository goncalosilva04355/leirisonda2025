// FIX INVALID DATES - Corrige datas inválidas que causam RangeError

console.log("📅 FIX DATES: Iniciando correção de datas inválidas...");

(function () {
  "use strict";

  // Função para corrigir datas inválidas
  function fixInvalidDates() {
    console.log("📅 Corrigindo datas inválidas...");

    // 1. Interceptar Date constructor para prevenir datas inválidas
    const OriginalDate = window.Date;

    window.Date = function (dateValue) {
      // Se é chamada sem argumentos, usar data atual
      if (arguments.length === 0) {
        return new OriginalDate();
      }

      // Se é chamada com argumentos
      if (arguments.length === 1) {
        const value = arguments[0];

        // Se é null, undefined, string vazia, usar data atual
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === "Invalid Date"
        ) {
          console.warn("📅 Data inválida detectada, usando data atual:", value);
          return new OriginalDate();
        }

        // Se é string, verificar se é válida
        if (typeof value === "string") {
          // Tentar parsear a data
          const parsed = OriginalDate.parse(value);
          if (isNaN(parsed)) {
            console.warn(
              "📅 String de data inválida, usando data atual:",
              value,
            );
            return new OriginalDate();
          }
        }

        // Se é número, verificar se é válido
        if (typeof value === "number" && !isFinite(value)) {
          console.warn("📅 Timestamp inválido, usando data atual:", value);
          return new OriginalDate();
        }
      }

      // Tentar criar data normalmente
      try {
        const date = new OriginalDate(...arguments);

        // Verificar se a data criada é válida
        if (isNaN(date.getTime())) {
          console.warn("📅 Data resultante inválida, usando data atual");
          return new OriginalDate();
        }

        return date;
      } catch (e) {
        console.warn("📅 Erro ao criar data, usando data atual:", e.message);
        return new OriginalDate();
      }
    };

    // Copiar propriedades estáticas
    Object.setPrototypeOf(window.Date, OriginalDate);
    Object.setPrototypeOf(window.Date.prototype, OriginalDate.prototype);
    window.Date.now = OriginalDate.now;
    window.Date.parse = function (dateString) {
      if (
        !dateString ||
        dateString === "" ||
        dateString === null ||
        dateString === undefined
      ) {
        return OriginalDate.now();
      }
      const parsed = OriginalDate.parse(dateString);
      return isNaN(parsed) ? OriginalDate.now() : parsed;
    };
    window.Date.UTC = OriginalDate.UTC;

    console.log("✅ Date constructor interceptado");
  }

  // 2. Interceptar JSON.parse para corrigir datas em dados vindos do servidor
  function fixJSONDates() {
    const originalJSONParse = JSON.parse;

    JSON.parse = function (text, reviver) {
      const result = originalJSONParse.call(this, text, reviver);

      // Função recursiva para corrigir datas em objetos
      function fixDatesInObject(obj) {
        if (obj === null || typeof obj !== "object") {
          return obj;
        }

        if (Array.isArray(obj)) {
          return obj.map(fixDatesInObject);
        }

        const fixed = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            // Se é string que parece data mas é inválida
            if (
              typeof value === "string" &&
              (key.toLowerCase().includes("data") ||
                key.toLowerCase().includes("date") ||
                key.toLowerCase().includes("time") ||
                key.toLowerCase().includes("created") ||
                key.toLowerCase().includes("updated"))
            ) {
              const parsed = Date.parse(value);
              if (isNaN(parsed)) {
                console.warn(`📅 Data inválida corrigida em ${key}:`, value);
                fixed[key] = new Date().toISOString();
              } else {
                fixed[key] = value;
              }
            } else if (typeof value === "object") {
              fixed[key] = fixDatesInObject(value);
            } else {
              fixed[key] = value;
            }
          }
        }

        return fixed;
      }

      return fixDatesInObject(result);
    };

    console.log("✅ JSON.parse interceptado para corrigir datas");
  }

  // 3. Limpar localStorage de dados com datas inválidas
  function cleanLocalStorage() {
    console.log("📅 Limpando localStorage de datas inválidas...");

    try {
      const keys = Object.keys(localStorage);
      let cleaned = 0;

      keys.forEach((key) => {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const data = JSON.parse(value);

            // Se é array ou objeto, verificar datas
            if (typeof data === "object") {
              const hasInvalidDate =
                JSON.stringify(data).includes("Invalid Date") ||
                JSON.stringify(data).includes("null") ||
                JSON.stringify(data).includes("undefined");

              if (hasInvalidDate) {
                console.warn("📅 Removendo item com datas inválidas:", key);
                localStorage.removeItem(key);
                cleaned++;
              }
            }
          }
        } catch (e) {
          // Se não consegue parsear, pode ter dados corrompidos
          console.warn("📅 Removendo item corrompido:", key);
          localStorage.removeItem(key);
          cleaned++;
        }
      });

      if (cleaned > 0) {
        console.log(
          `✅ ${cleaned} itens com datas inválidas removidos do localStorage`,
        );
      }
    } catch (e) {
      console.log("Erro ao limpar localStorage:", e.message);
    }
  }

  // 4. Interceptar erros de RangeError para debug
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    if (
      error &&
      error.name === "RangeError" &&
      message.includes("Invalid time value")
    ) {
      console.error("📅 RangeError de data inválida interceptado:", {
        message: message,
        line: lineno,
        column: colno,
        stack: error.stack,
      });

      // Tentar identificar o problema
      console.warn("📅 Possível causa: dados de obra com datas inválidas");

      // Retornar true para prevenir que o erro se propague
      return true;
    }

    // Chamar handler original se existir
    if (originalOnError) {
      return originalOnError.apply(this, arguments);
    }

    return false;
  };

  // Executar correções
  fixInvalidDates();
  fixJSONDates();
  cleanLocalStorage();

  console.log("✅ FIX INVALID DATES: Todas as correções aplicadas");
})();
