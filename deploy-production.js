#!/usr/bin/env node

/**
 * Script de Deploy para Produção Netlify
 * Leirisonda App - Deploy automatizado
 */

const fs = require("fs");
const path = require("path");

console.log("🚀 Iniciando deploy para produção Netlify...");

// Verificar se o build existe
const distPath = path.join(__dirname, "dist");
if (!fs.existsSync(distPath)) {
  console.error(
    "❌ Pasta dist não encontrada. Execute npm run build primeiro.",
  );
  process.exit(1);
}

// Verificar arquivos essenciais
const essentialFiles = ["dist/index.html", "dist/assets"];

for (const file of essentialFiles) {
  if (!fs.existsSync(path.join(__dirname, file))) {
    console.error(`❌ Arquivo essencial não encontrado: ${file}`);
    process.exit(1);
  }
}

console.log(
  "✅ Build verificado - todos os arquivos essenciais estão presentes",
);

// Mostrar informações do deploy
console.log("\n📊 Informações do Deploy:");
console.log("- Site: leirisonda.netlify.app");
console.log("- Pasta de publicação: dist");
console.log("- Comando de build: npm ci && npm run build");

// Instruções para deploy manual
console.log("\n📝 Instruções para deploy:");
console.log("1. Acesse: https://app.netlify.com/sites/leirisonda/deploys");
console.log('2. Clique em "Drag and drop your site folder here"');
console.log('3. Arraste a pasta "dist" para o upload');
console.log("4. Aguarde o deploy completar");

// Verificar se netlify CLI está disponível
const { execSync } = require("child_process");

try {
  execSync("netlify --version", { stdio: "ignore" });
  console.log("\n🎉 Netlify CLI detectado! Fazendo deploy automático...");

  // Deploy automático
  execSync("netlify deploy --prod --dir=dist", { stdio: "inherit" });

  console.log("\n✅ Deploy completado com sucesso!");
  console.log("🌐 Site disponível em: https://leirisonda.netlify.app");
} catch (error) {
  console.log("\n⚠️  Netlify CLI não encontrado ou erro no deploy");
  console.log("📦 Instale com: npm install -g netlify-cli");
  console.log("🔑 Configure com: netlify login");
  console.log("🔗 Conecte com: netlify link");
}

console.log("\n🏁 Script de deploy finalizado!");
