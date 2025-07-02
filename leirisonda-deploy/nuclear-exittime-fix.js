// NUCLEAR EXITTIME FIX - Solução nuclear para remover exitTime undefined

console.log("☢️ NUCLEAR: Iniciando solução nuclear para exitTime...");

(function () {
  "use strict";

  // Função para limpar exitTime de qualquer objeto
  function nukeExitTime(obj) {
    if (!obj || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => nukeExitTime(item));
    }

    const nuked = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // NUNCA incluir exitTime se for undefined
        if (key === "exitTime" && obj[key] === undefined) {
          console.warn("☢️ NUCLEAR: exitTime undefined NUKED!");
          continue;
        }

        // Se exitTime não é undefined, ainda limpar se for problemático
        if (key === "exitTime" && (obj[key] === null || obj[key] === "")) {
          console.warn("☢️ NUCLEAR: exitTime problemático NUKED!");
          continue;
        }

        nuked[key] =
          typeof obj[key] === "object" ? nukeExitTime(obj[key]) : obj[key];
      }
    }
    return nuked;
  }

  // Interceptar TODOS os métodos nativos do Object
  const originalDefineProperty = Object.defineProperty;
  const originalDefineProperties = Object.defineProperties;
  const originalAssign = Object.assign;

  Object.assign = function (target, ...sources) {
    const nukeSources = sources.map((source) => {
      if (
        source &&
        typeof source === "object" &&
        "exitTime" in source &&
        source.exitTime === undefined
      ) {
        console.warn("☢️ NUCLEAR: Object.assign exitTime nuked");
        return nukeExitTime(source);
      }
      return source;
    });
    return originalAssign.call(this, target, ...nukeSources);
  };

  // Interceptar JSON.parse para limpar dados que chegam
  const originalParse = JSON.parse;
  JSON.parse = function (text, reviver) {
    const result = originalParse.call(this, text, reviver);

    if (result && typeof result === "object") {
      // Se contém exitTime undefined, nukear
      if ("exitTime" in result && result.exitTime === undefined) {
        console.warn("☢️ NUCLEAR: JSON.parse exitTime nuked");
        return nukeExitTime(result);
      }

      // Se é array e algum item tem exitTime undefined
      if (Array.isArray(result)) {
        const hasProblematicExitTime = result.some(
          (item) =>
            item &&
            typeof item === "object" &&
            "exitTime" in item &&
            item.exitTime === undefined,
        );

        if (hasProblematicExitTime) {
          console.warn("☢️ NUCLEAR: Array com exitTime nuked");
          return nukeExitTime(result);
        }
      }
    }

    return result;
  };

  // Interceptar JSON.stringify para última linha de defesa
  const originalStringify = JSON.stringify;
  JSON.stringify = function (value, replacer, space) {
    if (value && typeof value === "object") {
      // Verificar se tem exitTime undefined
      const checkForExitTime = (obj) => {
        if (!obj || typeof obj !== "object") return false;

        if ("exitTime" in obj && obj.exitTime === undefined) return true;

        for (const key in obj) {
          if (obj.hasOwnProperty(key) && typeof obj[key] === "object") {
            if (checkForExitTime(obj[key])) return true;
          }
        }

        return false;
      };

      if (checkForExitTime(value)) {
        console.warn("☢️ NUCLEAR: JSON.stringify exitTime nuked");
        value = nukeExitTime(value);
      }
    }

    return originalStringify.call(this, value, replacer, space);
  };

  // Interceptar Fetch a nível de Request
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (init && init.body && typeof init.body === "string") {
      try {
        // Verificar se o body contém exitTime undefined
        if (
          init.body.includes('"exitTime":undefined') ||
          init.body.includes('"exitTime": undefined')
        ) {
          console.warn(
            "☢️ NUCLEAR: Fetch body com exitTime undefined detectado",
          );

          // Remover todas as referências a exitTime undefined
          init.body = init.body
            .replace(/"exitTime":\s*undefined/g, "")
            .replace(/,\s*"exitTime":\s*undefined/g, "")
            .replace(/"exitTime":\s*undefined,/g, "")
            .replace(/{\s*"exitTime":\s*undefined\s*}/g, "{}")
            .replace(/,\s*}/g, "}") // Limpar vírgulas órfãs
            .replace(/{\s*,/g, "{"); // Limpar vírgulas no início

          console.warn("☢️ NUCLEAR: Fetch body limpo");
        }
      } catch (e) {
        // Ignorar erros de parsing
      }
    }

    return originalFetch.call(this, input, init);
  };

  // Interceptar WebSocket para casos extremos
  const originalWebSocket = window.WebSocket;
  window.WebSocket = function (url, protocols) {
    const ws = new originalWebSocket(url, protocols);

    const originalSend = ws.send;
    ws.send = function (data) {
      if (typeof data === "string" && data.includes("exitTime")) {
        try {
          const parsed = JSON.parse(data);
          if (parsed && "exitTime" in parsed && parsed.exitTime === undefined) {
            console.warn("☢️ NUCLEAR: WebSocket exitTime nuked");
            data = JSON.stringify(nukeExitTime(parsed));
          }
        } catch (e) {
          // Se não conseguir parsear, tentar regex
          if (data.includes('"exitTime":undefined')) {
            data = data.replace(/"exitTime":\s*undefined/g, "");
            console.warn("☢️ NUCLEAR: WebSocket regex exitTime nuked");
          }
        }
      }

      return originalSend.call(this, data);
    };

    return ws;
  };

  // Monitor extremo - verificar window a cada 1 segundo por exitTime
  let monitorCount = 0;
  const extremeMonitor = setInterval(() => {
    monitorCount++;

    // Verificar se há variáveis globais com exitTime undefined
    for (const key in window) {
      try {
        const value = window[key];
        if (
          value &&
          typeof value === "object" &&
          "exitTime" in value &&
          value.exitTime === undefined
        ) {
          console.warn(`☢️ NUCLEAR: Global ${key} com exitTime nuked`);
          window[key] = nukeExitTime(value);
        }
      } catch (e) {
        // Ignorar erros de acesso
      }
    }

    // Parar após 2 minutos
    if (monitorCount > 120) {
      clearInterval(extremeMonitor);
    }
  }, 1000);

  // Interceptar console.error para detectar quando o erro ainda acontece
  const originalConsoleError = console.error;
  console.error = function (...args) {
    const message = args.join(" ");

    if (message.includes("exitTime") && message.includes("undefined")) {
      console.warn("☢️ NUCLEAR: ERRO exitTime AINDA ACONTECENDO!", message);

      // Tentar encontrar e nukear dados problemáticos no localStorage
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const value = localStorage.getItem(key);

          if (
            value &&
            value.includes("exitTime") &&
            value.includes("undefined")
          ) {
            console.warn(
              `☢️ NUCLEAR: localStorage ${key} com exitTime corrigido`,
            );
            const parsed = JSON.parse(value);
            const nuked = nukeExitTime(parsed);
            localStorage.setItem(key, JSON.stringify(nuked));
          }
        }
      } catch (e) {
        // Ignorar
      }
    }

    return originalConsoleError.apply(this, args);
  };

  console.log(
    "☢️ NUCLEAR: Solução nuclear ativa - exitTime será destruído em qualquer formato!",
  );
})();
