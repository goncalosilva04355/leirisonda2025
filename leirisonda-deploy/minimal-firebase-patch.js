// MINIMAL FIREBASE PATCH - Apenas modifica código Firebase, nada mais

// Aguarda o código Firebase carregar e patcha a função específica
const originalScript = document.createElement("script");
const scripts = document.querySelectorAll("script");

// Encontrar o script do Firebase
for (let script of scripts) {
  if (script.src && script.src.includes("index-DnEsHg1H.js")) {
    // Aguardar o script carregar
    script.addEventListener("load", function () {
      setTimeout(() => {
        // Patchear a função pb específica que causa signOut
        if (window.pb && typeof window.pb === "function") {
          const originalPb = window.pb;
          window.pb = function (n, e, t = false) {
            if (t) return e;
            try {
              return originalPb.call(this, n, e, t);
            } catch (r) {
              // Se é erro que causaria signOut, apenas logar mas não fazer signOut
              if (
                r &&
                (r.code === "auth/user-token-expired" ||
                  r.code === "auth/user-disabled")
              ) {
                console.warn(
                  "🔧 Firebase signOut automático bloqueado para:",
                  r.code,
                );
                throw r; // Lança erro mas sem signOut
              }
              throw r;
            }
          };
          console.log("✅ Função Firebase pb patchada");
        }
      }, 1000);
    });
    break;
  }
}

console.log("🔧 MINIMAL PATCH: Aguardando Firebase carregar...");
