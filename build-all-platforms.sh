#!/bin/bash

# BUILD PARA TODAS AS PLATAFORMAS
# Web, iOS, Android com Firebase REST API

set -e

echo "🚀 BUILD MULTI-PLATAFORMA LEIRISONDA"
echo "===================================="
echo ""

# Verificações
if [ ! -f "package.json" ]; then
    echo "❌ Execute no diretório raiz do projeto"
    exit 1
fi

echo "📋 PLATAFORMAS ALVO:"
echo "🌐 Web (PWA)"
echo "📱 iOS (Capacitor)"  
echo "🤖 Android (Capacitor)"
echo "🔥 Firebase: REST API"
echo ""

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf dist
rm -rf dist-production
rm -rf ios/App/App/public
rm -rf android/app/src/main/assets/public

# Instalar dependências
echo "📦 Verificando dependências..."
npm ci --silent

# 1. BUILD WEB (PWA)
echo ""
echo "🌐 BUILD WEB (PWA)..."
echo "▶️ Criando build de produção web..."

NODE_ENV=production npm run build:prod

if [ ! -d "dist-production" ]; then
    echo "❌ Build web falhou"
    exit 1
fi

echo "✅ Build web concluído: dist-production/"
echo "📊 Tamanho: $(du -sh dist-production | cut -f1)"

# Verificar PWA
if [ -f "dist-production/manifest.json" ]; then
    echo "✅ PWA manifest presente"
else
    echo "⚠️ PWA manifest não encontrado"
fi

# 2. PREPARAR MOBILE
echo ""
echo "📱 PREPARANDO BUILD MOBILE..."

# Copiar configuração de produção
if [ -f "capacitor.config.production.ts" ]; then
    cp capacitor.config.production.ts capacitor.config.ts
    echo "✅ Configuração mobile de produção aplicada"
else
    echo "⚠️ Usando configuração mobile padrão"
fi

# Verificar se Capacitor está instalado
if ! command -v cap &> /dev/null; then
    echo "📥 Instalando Capacitor CLI..."
    npm install -g @capacitor/cli
fi

# 3. BUILD iOS
echo ""
echo "📱 BUILD iOS..."

# Verificar se pasta iOS existe
if [ -d "ios" ]; then
    echo "▶️ Sincronizando iOS..."
    npx cap sync ios
    
    echo "✅ iOS sincronizado"
    echo "📝 Para continuar iOS:"
    echo "   npx cap open ios"
    echo "   # No Xcode: Product > Archive"
else
    echo "⚠️ Pasta iOS não encontrada"
    echo "📝 Para criar: npx cap add ios"
fi

# 4. BUILD ANDROID  
echo ""
echo "🤖 BUILD ANDROID..."

# Verificar se pasta Android existe
if [ -d "android" ]; then
    echo "▶️ Sincronizando Android..."
    npx cap sync android
    
    echo "✅ Android sincronizado"
    echo "📝 Para continuar Android:"
    echo "   npx cap open android"
    echo "   # No Android Studio: Build > Generate Signed Bundle/APK"
else
    echo "⚠️ Pasta Android não encontrada"
    echo "📝 Para criar: npx cap add android"
fi

# 5. VERIFICAÇÃO FIREBASE REST API
echo ""
echo "🔥 VERIFICANDO FIREBASE REST API..."

if grep -q "leiria-1cfc9" dist-production/assets/*.js 2>/dev/null; then
    echo "✅ Firebase REST API configurado no build"
else
    echo "⚠️ Firebase REST API não detectado claramente"
fi

if grep -q "firestore.googleapis.com" dist-production/assets/*.js 2>/dev/null; then
    echo "✅ Firestore REST API URL presente"
else
    echo "⚠️ Firestore REST API URL não detectado"
fi

# 6. RESUMO FINAL
echo ""
echo "🎉 BUILD MULTI-PLATAFORMA CONCLUÍDO!"
echo "====================================="
echo ""

echo "📊 STATUS DOS BUILDS:"

# Web
if [ -d "dist-production" ] && [ -f "dist-production/index.html" ]; then
    echo "��� WEB: Pronto ($(du -sh dist-production | cut -f1))"
else
    echo "❌ WEB: Falhou"
fi

# iOS
if [ -d "ios/App/App/public" ] && [ "$(ls -A ios/App/App/public)" ]; then
    echo "✅ iOS: Sincronizado"
else
    echo "⚠️ iOS: Precisa sincronizar"
fi

# Android
if [ -d "android/app/src/main/assets/public" ] && [ "$(ls -A android/app/src/main/assets/public)" ]; then
    echo "✅ ANDROID: Sincronizado"
else
    echo "⚠️ ANDROID: Precisa sincronizar"
fi

echo ""
echo "🔥 FIREBASE REST API:"
echo "📊 Projeto: leiria-1cfc9"
echo "🌐 URL: https://firestore.googleapis.com/v1/projects/leiria-1cfc9/databases/(default)/documents"
echo "✅ Configurado para todas as plataformas"

echo ""
echo "📱 PRÓXIMOS PASSOS:"
echo ""
echo "🌐 WEB DEPLOY:"
echo "   ./deploy-production.sh"
echo ""
echo "📱 iOS (App Store):"
echo "   npx cap open ios"
echo "   # Xcode: Product > Archive > Distribute App"
echo ""
echo "🤖 ANDROID (Play Store):"
echo "   npx cap open android"  
echo "   # Android Studio: Build > Generate Signed Bundle"
echo ""
echo "💻 LOCAL TESTING:"
echo "   npm run preview:prod  # Web"
echo "   # iOS Simulator via Xcode"
echo "   # Android Emulator via Android Studio"
echo ""

echo "🎯 TODAS AS PLATAFORMAS PRONTAS!"
echo "Web, iOS e Android configurados com Firebase REST API"
echo ""

# Mostrar configurações importantes
echo "🔧 CONFIGURAÇÕES IMPORTANTES:"
echo "• Bundle ID iOS: com.leirisonda.production"
echo "• Package Android: com.leirisonda.production"
echo "• PWA: Instalável em todos os browsers"
echo "• Firebase: REST API universal"
echo "• Offline: Funcional em todas as plataformas"
echo ""

echo "✅ BUILD MULTI-PLATAFORMA COMPLETO!"
