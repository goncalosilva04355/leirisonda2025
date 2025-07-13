const fs = require("fs");

// Ler o arquivo App.tsx
const filePath = "/src/App.tsx";
let content = fs.readFileSync(filePath, "utf8");

// Substituir o return vazio por return result na linha apropriada
content = content.replace(
  /(\s+)return;(\s+\/\/ Fallback|)/,
  "$1return result;$2",
);

// Escrever o arquivo corrigido
fs.writeFileSync(filePath, content);

console.log("Correção aplicada ao App.tsx");
