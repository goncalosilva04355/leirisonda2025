#!/bin/bash

# SETUP COMPLETO DA APLICAÇÃO DE PRODUÇÃO LEIRISONDA
# Cria uma aplicação de produção idêntica à de desenvolvimento
# com Firebase via REST API

set -e

echo "🚀 SETUP APLICAÇÃO DE PRODUÇÃO LEIRISONDA"
echo "=========================================="
echo ""

# Verificações iniciais
echo "🔍 Verificando pré-requisitos..."

if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Erro: Node.js não está instalado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ Erro: npm não está instalado"
    exit 1
fi

echo "✅ Pré-requisitos verificados"

# Configurações
PROD_DIR="../leirisonda-production"
CURRENT_DIR=$(pwd)

echo ""
echo "📋 CONFIGURAÇÕES:"
echo "📁 Diretório atual: $CURRENT_DIR"
echo "📁 Diretório produção: $PROD_DIR"
echo "🔥 Firebase: REST API (leiria-1cfc9)"
echo ""

# Perguntar confirmação
read -p "Continuar com a criação da aplicação de produção? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "❌ Operação cancelada"
    exit 0
fi

# Criar diretório de produção
echo "📁 Criando diretório de produção..."
if [ -d "$PROD_DIR" ]; then
    echo "⚠️ Diretório já existe, removendo..."
    rm -rf "$PROD_DIR"
fi

mkdir -p "$PROD_DIR"
echo "✅ Diretório criado: $PROD_DIR"

# Copiar arquivos essenciais
echo ""
echo "📋 Copiando estrutura da aplicação..."

# Copiar diretórios principais
directories=("src" "public" "ios" "android" "scripts" "netlify")
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "📁 Copiando $dir..."
        cp -r "$dir" "$PROD_DIR/"
    else
        echo "⚠️ Diretório $dir não encontrado, ignorando..."
    fi
done

# Copiar arquivos de configuração essenciais
files=(
    "tsconfig.json"
    "tsconfig.build.json"
    "tailwind.config.ts"
    "postcss.config.cjs"
    "index.html"
    "capacitor.config.ts"
    "netlify.toml"
    "vercel.json"
    "firestore.rules"
    "manifest.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "📄 Copiando $file..."
        cp "$file" "$PROD_DIR/"
    else
        echo "⚠️ Arquivo $file não encontrado, ignorando..."
    fi
done

echo "✅ Estrutura copiada"

# Copiar e configurar package.json
echo ""
echo "📦 Configurando package.json para produção..."
if [ -f "package-production.json" ]; then
    cp "package-production.json" "$PROD_DIR/package.json"
    echo "✅ package.json de produção configurado"
else
    cp "package.json" "$PROD_DIR/"
    echo "⚠️ Usando package.json original (recomendado usar package-production.json)"
fi

# Copiar configurações de produção
echo ""
echo "⚙️ Configurando ambiente de produção..."

# Vite config
if [ -f "vite.config.production.ts" ]; then
    cp "vite.config.production.ts" "$PROD_DIR/vite.config.ts"
    echo "✅ Configuração Vite de produção aplicada"
else
    cp "vite.config.ts" "$PROD_DIR/"
    echo "⚠️ Usando vite.config.ts original"
fi

# Variáveis de ambiente
if [ -f ".env.production" ]; then
    cp ".env.production" "$PROD_DIR/"
    echo "�� Variáveis de ambiente de produção configuradas"
fi

# Scripts e documentação
files_extra=(
    "deploy-production.sh"
    "README-PRODUCTION.md"
)

for file in "${files_extra[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$PROD_DIR/"
        echo "✅ Copiado: $file"
    fi
done

# Tornar scripts executáveis
if [ -f "$PROD_DIR/deploy-production.sh" ]; then
    chmod +x "$PROD_DIR/deploy-production.sh"
    echo "✅ Script de deploy configurado como executável"
fi

# Navegar para diretório de produção
cd "$PROD_DIR"

echo ""
echo "📦 Instalando dependências na aplicação de produção..."
npm install --silent

# Verificar se Firebase REST API está configurado
echo ""
echo "🔥 Verificando configuração Firebase REST API..."
if [ -f "src/config/firebaseProduction.ts" ]; then
    echo "✅ Configuração Firebase REST API encontrada"
else
    echo "⚠️ Criando configuração Firebase REST API..."
    mkdir -p src/config
    cat > src/config/firebaseProduction.ts << 'EOF'
// CONFIGURAÇÃO FIREBASE PRODUÇÃO - REST API
export const PRODUCTION_FIREBASE_CONFIG = {
  projectId: "leiria-1cfc9",
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  restApiUrl: "https://firestore.googleapis.com/v1/projects/leiria-1cfc9/databases/(default)/documents"
};

console.log('🚀 Firebase REST API configurado para PRODUÇÃO');
console.log('📊 Projeto:', PRODUCTION_FIREBASE_CONFIG.projectId);
EOF
    echo "✅ Configuração Firebase REST API criada"
fi

# Teste de build
echo ""
echo "🏗️ Testando build de produção..."
npm run build:prod

if [ -d "dist-production" ] && [ -f "dist-production/index.html" ]; then
    echo "✅ Build de produção criado com sucesso!"
    echo "📊 Tamanho: $(du -sh dist-production | cut -f1)"
else
    echo "❌ Erro: Build de produção falhou"
    cd "$CURRENT_DIR"
    exit 1
fi

# Voltar ao diretório original
cd "$CURRENT_DIR"

# Resumo final
echo ""
echo "🎉 APLICAÇÃO DE PRODUÇÃO CRIADA COM SUCESSO!"
echo "=============================================="
echo ""
echo "📋 RESUMO:"
echo "📁 Localização: $PROD_DIR"
echo "📦 Nome: leirisonda-production"
echo "🔥 Firebase: REST API (leiria-1cfc9)"
echo "⚡ Build: Otimizado para produção"
echo "📱 PWA: Ativo"
echo "🌐 Deploy: Scripts automáticos incluídos"
echo ""

echo "📚 PRÓXIMOS PASSOS:"
echo "1. cd $PROD_DIR"
echo "2. ./deploy-production.sh"
echo ""

echo "🌐 OPÇÕES DE DEPLOY:"
echo "• Netlify: npm run deploy:netlify"
echo "• Vercel: npm run deploy:vercel"
echo "• Firebase: npm run deploy:firebase"
echo "• Script automático: ./deploy-production.sh"
echo ""

echo "📱 MOBILE:"
echo "• Sincronizar: npm run capacitor:sync"
echo "• iOS: npm run capacitor:ios"
echo "• Android: npm run capacitor:android"
echo ""

echo "✅ A aplicação de produção está pronta!"
echo "🔗 Firebase REST API configurado e funcional"
echo "📊 Build otimizado para máxima performance"
echo ""

# Perguntar se quer fazer deploy imediato
echo "🚀 Quer fazer deploy imediatamente?"
read -p "Fazer deploy agora? (y/N): " deploy_now

if [[ $deploy_now =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Iniciando deploy..."
    cd "$PROD_DIR"
    ./deploy-production.sh
    cd "$CURRENT_DIR"
else
    echo ""
    echo "📝 Para fazer deploy depois:"
    echo "cd $PROD_DIR && ./deploy-production.sh"
fi

echo ""
echo "🎯 SETUP CONCLUÍDO COM SUCESSO!"
echo "A aplicação Leirisonda de produção está pronta para uso."
