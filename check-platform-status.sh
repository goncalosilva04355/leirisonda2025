#!/bin/bash

# VERIFICAÇÃO DO STATUS DE TODAS AS PLATAFORMAS
# Verifica se Web, iOS e Android estão configurados corretamente

echo "🔍 VERIFICAÇÃO MULTI-PLATAFORMA LEIRISONDA"
echo "=========================================="
echo ""

# Função para verificar arquivo
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
        return 0
    else
        echo "❌ $1"
        return 1
    fi
}

# Função para verificar diretório
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1/"
        return 0
    else
        echo "❌ $1/"
        return 1
    fi
}

# Contadores
web_ready=0
ios_ready=0  
android_ready=0
firebase_ready=0

echo "🌐 VERIFICAÇÃO WEB (PWA):"
echo "-------------------------"

# Verificar arquivos essenciais web
if check_file "package.json"; then ((web_ready++)); fi
if check_file "vite.config.ts"; then ((web_ready++)); fi
if check_file "index.html"; then ((web_ready++)); fi
if check_file "public/manifest.json"; then ((web_ready++)); fi

# Verificar se PWA está configurado
if [ -f "public/manifest.json" ]; then
    if grep -q "standalone" public/manifest.json; then
        echo "✅ PWA configurado (standalone)"
        ((web_ready++))
    else
        echo "⚠️ PWA não configurado como standalone"
    fi
fi

# Verificar service worker
if [ -f "public/firebase-messaging-sw.js" ]; then
    echo "✅ Service Worker presente"
    ((web_ready++))
else
    echo "⚠️ Service Worker não encontrado"
fi

echo ""
echo "📱 VERIFICAÇÃO iOS:"
echo "-------------------"

# Verificar estrutura iOS
if check_dir "ios"; then ((ios_ready++)); fi
if check_dir "ios/App"; then ((ios_ready++)); fi
if check_file "ios/App/Podfile"; then ((ios_ready++)); fi
if check_file "ios/App/App/Info.plist"; then ((ios_ready++)); fi

# Verificar configuração iOS
if [ -f "ios/App/App/Info.plist" ]; then
    if grep -q "Leirisonda" ios/App/App/Info.plist; then
        echo "✅ Nome da app configurado"
        ((ios_ready++))
    else
        echo "⚠️ Nome da app não configurado"
    fi
fi

# Verificar Capacitor iOS
if [ -f "capacitor.config.ts" ]; then
    if grep -q "ios" capacitor.config.ts; then
        echo "✅ Capacitor iOS configurado"
        ((ios_ready++))
    else
        echo "⚠️ Capacitor iOS não configurado"
    fi
fi

echo ""
echo "🤖 VERIFICAÇÃO ANDROID:"
echo "-----------------------"

# Verificar estrutura Android
if check_dir "android"; then ((android_ready++)); fi
if check_dir "android/app"; then ((android_ready++)); fi
if check_file "android/app/build.gradle"; then ((android_ready++)); fi
if check_file "android/app/src/main/AndroidManifest.xml"; then ((android_ready++)); fi

# Verificar configuração Android
if [ -f "android/app/src/main/AndroidManifest.xml" ]; then
    if grep -q "leirisonda" android/app/src/main/AndroidManifest.xml; then
        echo "✅ Package name configurado"
        ((android_ready++))
    else
        echo "⚠️ Package name não configurado"
    fi
fi

# Verificar Capacitor Android
if [ -f "capacitor.config.ts" ]; then
    if grep -q "android" capacitor.config.ts; then
        echo "✅ Capacitor Android configurado"
        ((android_ready++))
    else
        echo "⚠️ Capacitor Android não configurado"
    fi
fi

echo ""
echo "🔥 VERIFICAÇÃO FIREBASE REST API:"
echo "---------------------------------"

# Verificar configuração Firebase
if [ -f "src/utils/firestoreRestApi.ts" ]; then
    echo "✅ Firebase REST API implementado"
    ((firebase_ready++))
    
    if grep -q "leiria-1cfc9" src/utils/firestoreRestApi.ts; then
        echo "✅ Projeto Firebase correto (leiria-1cfc9)"
        ((firebase_ready++))
    else
        echo "❌ Projeto Firebase incorreto"
    fi
    
    if grep -q "firestore.googleapis.com" src/utils/firestoreRestApi.ts; then
        echo "✅ URL REST API correta"
        ((firebase_ready++))
    else
        echo "❌ URL REST API incorreta"
    fi
else
    echo "❌ Firebase REST API não encontrado"
fi

# Verificar configuração de produção
if [ -f "src/config/firebaseProduction.ts" ]; then
    echo "✅ Configuração Firebase produção presente"
    ((firebase_ready++))
else
    echo "⚠️ Configuração Firebase produção não encontrada"
fi

echo ""
echo "📦 VERIFICAÇÃO DEPENDÊNCIAS:"
echo "----------------------------"

# Verificar Node.js
if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo "✅ Node.js: $node_version"
else
    echo "❌ Node.js não instalado"
fi

# Verificar npm
if command -v npm &> /dev/null; then
    npm_version=$(npm --version)
    echo "✅ npm: $npm_version"
else
    echo "❌ npm não instalado"
fi

# Verificar Capacitor CLI
if command -v cap &> /dev/null; then
    cap_version=$(cap --version 2>/dev/null || echo "instalado")
    echo "✅ Capacitor CLI: $cap_version"
else
    echo "⚠️ Capacitor CLI não instalado globalmente"
fi

echo ""
echo "🎯 RESUMO DO STATUS:"
echo "===================="

# Calcular percentagens
web_percent=$((web_ready * 100 / 6))
ios_percent=$((ios_ready * 100 / 6))
android_percent=$((android_ready * 100 / 6))
firebase_percent=$((firebase_ready * 100 / 4))

echo ""
echo "🌐 WEB (PWA): $web_ready/6 ($web_percent%)"
if [ $web_percent -ge 80 ]; then
    echo "   Status: ✅ PRONTO PARA DEPLOY"
elif [ $web_percent -ge 60 ]; then
    echo "   Status: ⚠️ QUASE PRONTO"
else
    echo "   Status: ❌ PRECISA CONFIGURAÇÃO"
fi

echo ""
echo "📱 iOS: $ios_ready/6 ($ios_percent%)"
if [ $ios_percent -ge 80 ]; then
    echo "   Status: ✅ PRONTO PARA APP STORE"
elif [ $ios_percent -ge 60 ]; then
    echo "   Status: ⚠️ QUASE PRONTO"
else
    echo "   Status: ❌ PRECISA CONFIGURAÇÃO"
fi

echo ""
echo "🤖 ANDROID: $android_ready/6 ($android_percent%)"
if [ $android_percent -ge 80 ]; then
    echo "   Status: ✅ PRONTO PARA PLAY STORE"
elif [ $android_percent -ge 60 ]; then
    echo "   Status: ⚠️ QUASE PRONTO"
else
    echo "   Status: ❌ PRECISA CONFIGURAÇÃO"
fi

echo ""
echo "🔥 FIREBASE REST API: $firebase_ready/4 ($firebase_percent%)"
if [ $firebase_percent -ge 75 ]; then
    echo "   Status: ✅ TOTALMENTE FUNCIONAL"
elif [ $firebase_percent -ge 50 ]; then
    echo "   Status: ⚠️ PARCIALMENTE FUNCIONAL"
else
    echo "   Status: ❌ PRECISA CONFIGURAÇÃO"
fi

echo ""
echo "📊 STATUS GERAL:"
total_ready=$((web_ready + ios_ready + android_ready + firebase_ready))
total_possible=22
overall_percent=$((total_ready * 100 / total_possible))

if [ $overall_percent -ge 90 ]; then
    echo "🎉 EXCELENTE ($overall_percent%) - Todas as plataformas prontas!"
elif [ $overall_percent -ge 75 ]; then
    echo "✅ BOM ($overall_percent%) - Maioria das plataformas pronta"
elif [ $overall_percent -ge 50 ]; then
    echo "⚠️ PARCIAL ($overall_percent%) - Algumas plataformas precisam configuração"
else
    echo "❌ INCOMPLETO ($overall_percent%) - Configuração necessária"
fi

echo ""
echo "🚀 PRÓXIMAS AÇÕES RECOMENDADAS:"

if [ $web_percent -lt 80 ]; then
    echo "• Configurar PWA completamente"
fi

if [ $ios_percent -lt 80 ]; then
    echo "• Configurar projeto iOS no Xcode"
fi

if [ $android_percent -lt 80 ]; then
    echo "• Configurar projeto Android no Android Studio"
fi

if [ $firebase_percent -lt 75 ]; then
    echo "• Verificar configuração Firebase REST API"
fi

echo ""
echo "📚 COMANDOS ÚTEIS:"
echo "./build-all-platforms.sh     # Build todas as plataformas"
echo "./deploy-production.sh       # Deploy web"
echo "npx cap open ios            # Abrir iOS no Xcode"  
echo "npx cap open android        # Abrir Android no Android Studio"
echo ""

if [ $overall_percent -ge 90 ]; then
    echo "🎯 PARABÉNS! Todas as plataformas estão prontas para produção!"
fi
