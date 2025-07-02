// PATCH DIRETO PARA FIREBASE - SOLUÇÃO NUCLEAR
// Este script modifica diretamente o código JavaScript carregado

(function () {
  "use strict";

  console.log("🚀 Patch Direto: Iniciando interceptação de scripts...");

  // Override script loading to patch Firebase code
  const originalCreateElement = document.createElement;

  document.createElement = function (tagName) {
    const element = originalCreateElement.call(this, tagName);

    if (tagName.toLowerCase() === "script") {
      const originalSrcSetter = Object.getOwnPropertyDescriptor(
        HTMLScriptElement.prototype,
        "src",
      ).set;

      Object.defineProperty(element, "src", {
        get: function () {
          return this._src;
        },
        set: function (value) {
          this._src = value;

          // If this is the main Firebase script, intercept it
          if (value && value.includes("index-DnEsHg1H.js")) {
            console.log(
              "🎯 Patch Direto: Interceptando script Firebase:",
              value,
            );

            // Load the script manually and patch it
            fetch(value)
              .then((response) => response.text())
              .then((code) => {
                // Replace the problematic signOut call
                const patchedCode = code.replace(
                  /&&await n\.auth\.signOut\(\)/g,
                  "/* &&await n.auth.signOut() - PATCHED */",
                );

                if (patchedCode !== code) {
                  console.log("✅ Patch Direto: Código Firebase patched!");

                  // Create a blob with the patched code
                  const blob = new Blob([patchedCode], {
                    type: "application/javascript",
                  });
                  const patchedUrl = URL.createObjectURL(blob);

                  // Use the patched URL
                  originalSrcSetter.call(this, patchedUrl);
                } else {
                  console.log(
                    "⚠️ Patch Direto: Padrão não encontrado, usando original",
                  );
                  originalSrcSetter.call(this, value);
                }
              })
              .catch((error) => {
                console.error(
                  "❌ Patch Direto: Erro ao carregar script:",
                  error,
                );
                originalSrcSetter.call(this, value);
              });

            return;
          }

          originalSrcSetter.call(this, value);
        },
      });
    }

    return element;
  };

  console.log("✅ Patch Direto: Interceptação de scripts configurada");
})();
