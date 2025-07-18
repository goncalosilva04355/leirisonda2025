#!/bin/bash

echo "🚀 Deploy para Firebase Hosting - Leirisonda"
echo "============================================="
echo ""

# Verificar se o build existe
if [ ! -d "dist" ]; then
    echo "📦 Criando build da aplicação..."
    npm run build
    echo "✅ Build criado com sucesso!"
    echo ""
fi

echo "🔥 Configuração Firebase:"
echo "- Projeto: leiria-1cfc9"
echo "- Hosting URL: https://leiria-1cfc9.web.app"
echo ""

echo "📋 Para fazer deploy no Firebase Hosting:"
echo ""
echo "1️⃣  Instalar Firebase CLI (se ainda não estiver):"
echo "    npm install -g firebase-tools"
echo ""
echo "2️⃣  Fazer login no Firebase:"
echo "    firebase login"
echo ""
echo "3️⃣  Selecionar o projeto:"
echo "    firebase use leiria-1cfc9"
echo ""
echo "4️⃣  Fazer deploy:"
echo "    firebase deploy --only hosting"
echo ""
echo "✅ Ou usar o script npm:"
echo "    npm run firebase:deploy"
echo ""

echo "🌐 ALTERNATIVA MAIS SIMPLES - Netlify Drop:"
echo ""
echo "1. Vai a https://app.netlify.com/drop"
echo "2. Arrasta a pasta 'dist' para a página"
echo "3. Site online em 30 segundos!"
echo ""
echo "🎯 Ambas as opções são gratuitas e funcionam perfeitamente!"
