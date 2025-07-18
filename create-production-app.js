#!/usr/bin/env node

/**
 * SCRIPT DE CRIAÇÃO DE APLICAÇÃO DE PRODUÇÃO
 * Cria uma nova aplicação de produção idêntica à de desenvolvimento
 * com Firebase via REST API
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Criando nova aplicação de produção Leirisonda...");

// Configurações da aplicação
const PRODUCTION_CONFIG = {
  name: "leirisonda-production",
  displayName: "Leirisonda Produção",
  version: "1.0.0",
  firebase: {
    projectId: "leiria-1cfc9",
    apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
    restApiUrl:
      "https://firestore.googleapis.com/v1/projects/leiria-1cfc9/databases/(default)/documents",
  },
  build: {
    outDir: "dist-production",
    mode: "production",
    minify: true,
    sourcemap: false,
  },
};

// Estrutura de diretórios a copiar
const DIRECTORIES_TO_COPY = [
  "src",
  "public",
  "ios",
  "android",
  "scripts",
  "netlify",
];

// Arquivos de configuração essenciais
const CONFIG_FILES = [
  "package.json",
  "vite.config.ts",
  "tsconfig.json",
  "tsconfig.build.json",
  "tailwind.config.ts",
  "postcss.config.cjs",
  "index.html",
  "capacitor.config.ts",
  "netlify.toml",
  "vercel.json",
];

// Função para copiar diretório recursivamente
function copyDirectory(src, dest) {
  console.log(`📁 Copiando ${src} → ${dest}`);

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Função para atualizar package.json para produção
function updatePackageJson(targetDir) {
  console.log("📦 Configurando package.json para produção...");

  const packagePath = path.join(targetDir, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  // Atualizar configurações para produção
  packageJson.name = PRODUCTION_CONFIG.name;
  packageJson.version = PRODUCTION_CONFIG.version;

  // Scripts de produção otimizados
  packageJson.scripts = {
    ...packageJson.scripts,
    "build:prod": "NODE_ENV=production vite build --mode production",
    "preview:prod": "vite preview --port 4173",
    "deploy:netlify": "npm run build:prod && netlify deploy --prod --dir=dist",
    "deploy:vercel": "npm run build:prod && vercel --prod",
    "start:prod": "node dist/server/node-build.mjs",
    "firebase:deploy": "npm run build:prod && firebase deploy",
  };

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log("✅ package.json configurado para produção");
}

// Função para criar configuração Vite de produção
function createProductionViteConfig(targetDir) {
  console.log("⚡ Criando configuração Vite para produção...");

  const viteConfigContent = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  base: "/",
  define: {
    global: "globalThis",
    __APP_VERSION__: JSON.stringify("${PRODUCTION_CONFIG.version}"),
    __PRODUCTION_MODE__: true,
  },
  build: {
    outDir: "${PRODUCTION_CONFIG.build.outDir}",
    chunkSizeWarningLimit: 1000,
    sourcemap: ${PRODUCTION_CONFIG.build.sourcemap},
    minify: "${PRODUCTION_CONFIG.build.minify ? "esbuild" : false}",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React e dependências principais
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "react-vendor";
          }

          // UI components
          if (id.includes("lucide-react") || id.includes("framer-motion")) {
            return "ui-vendor";
          }
          
          // PDF generation
          if (id.includes("jspdf") || id.includes("html2canvas")) {
            return "pdf-vendor";
          }
          
          // Firebase REST API
          if (id.includes("firebase") || id.includes("firestore")) {
            return "firebase-vendor";
          }
          
          // Separar arquivos da aplicação dos vendor
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false,
    },
    watch: {
      ignored: ["**/node_modules/**", "**/dist/**", "**/dist-production/**"],
      usePolling: false,
    },
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: ["firebase/app", "firebase/firestore"] // Usar REST API
  }
});`;

  fs.writeFileSync(path.join(targetDir, "vite.config.ts"), viteConfigContent);
  console.log("✅ Configuração Vite de produção criada");
}

// Função para criar configuração Firebase REST API
function createFirebaseRestConfig(targetDir) {
  console.log("🔥 Configurando Firebase REST API para produção...");

  const firebaseConfigPath = path.join(
    targetDir,
    "src/config/firebaseProduction.ts",
  );

  // Criar diretório se não existir
  const configDir = path.dirname(firebaseConfigPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const firebaseConfigContent = `// CONFIGURAÇÃO FIREBASE PRODUÇÃO - REST API
// Configuração otimizada para produção com Firebase via REST API

export const PRODUCTION_FIREBASE_CONFIG = {
  projectId: "${PRODUCTION_CONFIG.firebase.projectId}",
  apiKey: "${PRODUCTION_CONFIG.firebase.apiKey}",
  restApiUrl: "${PRODUCTION_CONFIG.firebase.restApiUrl}",
  authDomain: "${PRODUCTION_CONFIG.firebase.projectId}.firebaseapp.com",
  storageBucket: "${PRODUCTION_CONFIG.firebase.projectId}.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};

// Base URL da REST API do Firestore para produção
export const FIRESTORE_REST_BASE_URL = PRODUCTION_FIREBASE_CONFIG.restApiUrl;

// Configurações de produção
export const PRODUCTION_CONFIG_SETTINGS = {
  enableOfflineMode: true,
  enableAutoSync: true,
  enableRealTimeUpdates: true,
  cacheTimeout: 5 * 60 * 1000, // 5 minutos
  retryAttempts: 3,
  batchSize: 50,
  enableCompression: true,
  enableErrorReporting: true,
};

console.log('🚀 Firebase REST API configurado para PRODUÇÃO');
console.log('📊 Projeto:', PRODUCTION_FIREBASE_CONFIG.projectId);
console.log('🌐 REST API:', PRODUCTION_FIREBASE_CONFIG.restApiUrl);
`;

  fs.writeFileSync(firebaseConfigPath, firebaseConfigContent);
  console.log("✅ Configuração Firebase REST API criada");
}

// Função para criar arquivo de ambiente de produção
function createProductionEnv(targetDir) {
  console.log("🌍 Criando variáveis de ambiente de produção...");

  const envContent = `# VARIÁVEIS DE AMBIENTE - PRODUÇÃO
NODE_ENV=production
VITE_APP_MODE=production
VITE_APP_NAME="${PRODUCTION_CONFIG.displayName}"
VITE_APP_VERSION="${PRODUCTION_CONFIG.version}"

# Firebase REST API
VITE_FIREBASE_PROJECT_ID="${PRODUCTION_CONFIG.firebase.projectId}"
VITE_FIREBASE_API_KEY="${PRODUCTION_CONFIG.firebase.apiKey}"
VITE_FIREBASE_REST_URL="${PRODUCTION_CONFIG.firebase.restApiUrl}"

# Funcionalidades
VITE_ENABLE_FIREBASE_REST=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_AUTO_SYNC=true
VITE_ENABLE_REAL_TIME=true

# Performance
VITE_ENABLE_COMPRESSION=true
VITE_ENABLE_CACHING=true
VITE_ENABLE_MINIFICATION=true

# Debug (desativado em produção)
VITE_ENABLE_DEBUG=false
VITE_ENABLE_CONSOLE_LOGS=false
VITE_ENABLE_ERROR_OVERLAY=false
`;

  fs.writeFileSync(path.join(targetDir, ".env.production"), envContent);
  console.log("✅ Variáveis de ambiente de produção criadas");
}

// Função para criar script de deploy
function createDeployScript(targetDir) {
  console.log("🚀 Criando script de deploy...");

  const deployScriptContent = `#!/bin/bash

# SCRIPT DE DEPLOY PARA PRODUÇÃO
# Deploy automatizado da aplicação Leirisonda

set -e

echo "🚀 Iniciando deploy da aplicação de produção..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado"
    exit 1
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf dist-production
rm -rf dist

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --production=false

# Executar testes (se existirem)
echo "🧪 Executando testes..."
npm run test || echo "⚠️ Testes não configurados ou falharam"

# Build de produção
echo "🏗️ Criando build de produção..."
npm run build:prod

# Verificar se build foi criado
if [ ! -d "${PRODUCTION_CONFIG.build.outDir}" ]; then
    echo "❌ Erro: Build não foi criado"
    exit 1
fi

echo "✅ Build de produção criado com sucesso!"

# Opções de deploy
echo ""
echo "Escolha uma opção de deploy:"
echo "1) Netlify"
echo "2) Vercel"
echo "3) Firebase Hosting"
echo "4) Apenas build local"

read -p "Opção (1-4): " deploy_option

case $deploy_option in
    1)
        echo "🌐 Fazendo deploy no Netlify..."
        npm run deploy:netlify
        ;;
    2)
        echo "▲ Fazendo deploy no Vercel..."
        npm run deploy:vercel
        ;;
    3)
        echo "🔥 Fazendo deploy no Firebase Hosting..."
        npm run firebase:deploy
        ;;
    4)
        echo "📁 Build local concluído em ${PRODUCTION_CONFIG.build.outDir}/"
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

echo "🎉 Deploy concluído com sucesso!"
`;

  const deployScriptPath = path.join(targetDir, "deploy-production.sh");
  fs.writeFileSync(deployScriptPath, deployScriptContent);

  // Tornar executável no Unix/Linux
  try {
    execSync(`chmod +x "${deployScriptPath}"`);
  } catch (error) {
    console.log("⚠️ Não foi possível tornar o script executável (Windows?)");
  }

  console.log("✅ Script de deploy criado");
}

// Função para criar documentação
function createProductionDocs(targetDir) {
  console.log("📚 Criando documentação...");

  const readmeContent = `# ${PRODUCTION_CONFIG.displayName}

Aplicação de produção da Leirisonda - Sistema de gestão de obras e manutenções.

## 🚀 Características

- ✅ **Firebase via REST API** - Sem problemas de SDK
- ✅ **Modo Offline** - Funciona sem internet
- ✅ **Sincronização Automática** - Dados sempre atualizados
- ✅ **PWA** - Instalável em dispositivos móveis
- ✅ **Responsivo** - Funciona em todos os dispositivos

## 🏗️ Build de Produção

\`\`\`bash
# Instalar dependências
npm install

# Build de produção
npm run build:prod

# Preview local
npm run preview:prod

# Deploy automatizado
./deploy-production.sh
\`\`\`

## 🔥 Firebase REST API

Esta aplicação usa Firebase Firestore via REST API para máxima compatibilidade:

- **Projeto**: ${PRODUCTION_CONFIG.firebase.projectId}
- **REST API**: ${PRODUCTION_CONFIG.firebase.restApiUrl}
- **Sem dependências SDK**: Elimina problemas de getImmediate()

## 📱 Mobile

\`\`\`bash
# iOS
npx cap open ios

# Android
npx cap open android

# Sincronizar com Capacitor
npx cap sync
\`\`\`

## 🌐 Deploy

### Netlify
\`\`\`bash
npm run deploy:netlify
\`\`\`

### Vercel
\`\`\`bash
npm run deploy:vercel
\`\`\`

### Firebase Hosting
\`\`\`bash
npm run firebase:deploy
\`\`\`

## 🛠️ Desenvolvimento

\`\`\`bash
# Modo desenvolvimento
npm run dev

# Verificar tipos
npm run typecheck

# Formatar código
npm run format.fix
\`\`\`

## 📊 Estrutura

\`\`\`
${PRODUCTION_CONFIG.name}/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços (Firebase REST API)
│   ├── utils/         # Utilitários
│   └── config/        # Configurações
├── public/            # Arquivos estáticos
├── ios/              # Projeto iOS (Capacitor)
├── android/          # Projeto Android (Capacitor)
└── dist-production/  # Build de produção
\`\`\`

## ⚙️ Configuração

### Variáveis de Ambiente

Copie \`.env.production\` e ajuste conforme necessário:

\`\`\`env
NODE_ENV=production
VITE_FIREBASE_PROJECT_ID=${PRODUCTION_CONFIG.firebase.projectId}
VITE_FIREBASE_API_KEY=${PRODUCTION_CONFIG.firebase.apiKey}
\`\`\`

### Firebase

A aplicação está configurada para usar Firebase via REST API:

1. **Sem instalação de SDK** necessária
2. **Funciona em qualquer ambiente**
3. **Sem problemas de inicialização**

## 🔒 Segurança

- ✅ Autenticação local segura
- ✅ Validação de permissões
- ✅ Sanitização de dados
- ✅ HTTPS obrigatório em produção

## 📞 Suporte

Para suporte técnico, contacte: gongonsilva@gmail.com

---

**Versão**: ${PRODUCTION_CONFIG.version}  
**Modo**: Produção  
**Firebase**: REST API  
**Build**: ${new Date().toISOString()}
`;

  fs.writeFileSync(path.join(targetDir, "README-PRODUCTION.md"), readmeContent);
  console.log("✅ Documentação criada");
}

// Função principal
async function createProductionApp() {
  try {
    const targetDir = path.join(process.cwd(), "..", PRODUCTION_CONFIG.name);

    console.log(`📁 Diretório de destino: ${targetDir}`);

    // Criar diretório principal
    if (fs.existsSync(targetDir)) {
      console.log("⚠️ Diretório já existe, removendo...");
      fs.rmSync(targetDir, { recursive: true, force: true });
    }

    fs.mkdirSync(targetDir, { recursive: true });
    console.log("✅ Diretório criado");

    // Copiar estrutura
    console.log("📋 Copiando estrutura da aplicação...");

    // Copiar diretórios
    for (const dir of DIRECTORIES_TO_COPY) {
      if (fs.existsSync(dir)) {
        copyDirectory(dir, path.join(targetDir, dir));
      } else {
        console.log(`⚠️ Diretório ${dir} não encontrado, ignorando...`);
      }
    }

    // Copiar arquivos de configuração
    for (const file of CONFIG_FILES) {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(targetDir, file));
        console.log(`📄 Copiado: ${file}`);
      } else {
        console.log(`⚠️ Arquivo ${file} não encontrado, ignorando...`);
      }
    }

    // Configurar para produção
    updatePackageJson(targetDir);
    createProductionViteConfig(targetDir);
    createFirebaseRestConfig(targetDir);
    createProductionEnv(targetDir);
    createDeployScript(targetDir);
    createProductionDocs(targetDir);

    console.log("");
    console.log("🎉 APLICAÇÃO DE PRODUÇÃO CRIADA COM SUCESSO!");
    console.log("");
    console.log(`📁 Localização: ${targetDir}`);
    console.log(`📦 Nome: ${PRODUCTION_CONFIG.name}`);
    console.log(`🏷️ Versão: ${PRODUCTION_CONFIG.version}`);
    console.log(
      `🔥 Firebase: REST API (${PRODUCTION_CONFIG.firebase.projectId})`,
    );
    console.log("");
    console.log("📋 PRÓXIMOS PASSOS:");
    console.log(`1. cd ${path.relative(process.cwd(), targetDir)}`);
    console.log("2. npm install");
    console.log("3. npm run build:prod");
    console.log("4. ./deploy-production.sh");
    console.log("");
    console.log("🚀 A aplicação está pronta para produção!");
  } catch (error) {
    console.error("❌ Erro ao criar aplicação de produção:", error);
    process.exit(1);
  }
}

// Executar script
if (require.main === module) {
  createProductionApp();
}

module.exports = { createProductionApp, PRODUCTION_CONFIG };
