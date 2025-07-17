#!/bin/bash

echo "🚀 Deploy da Correção de Produção - Leirisonda"
echo "================================================"

# 1. Build da aplicação
echo "📦 1. Fazendo build da aplicação..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build!"
    exit 1
fi

echo "✅ Build completo com sucesso!"

# 2. Verificar se a pasta dist existe
if [ ! -d "dist" ]; then
    echo "❌ Pasta dist não encontrada!"
    exit 1
fi

echo "✅ Pasta dist verificada"

# 3. Mostrar informações do deploy
echo ""
echo "📊 Informações do Deploy:"
echo "========================="
echo "🗂️  Ficheiros principais:"
ls -la dist/assets/ | grep -E "(App-Production|index)" | head -5

echo ""
echo "📏 Tamanhos dos ficheiros principais:"
du -h dist/assets/*.js | grep -E "(App-Production|index)" | head -3

echo ""
echo "🎯 Deploy pronto para:"
echo "   - Netlify: arrastar pasta dist/ para netlify.com/drop"
echo "   - Servidor: copiar conteúdo de dist/ para servidor web"
echo "   - CDN: fazer upload da pasta dist/"

echo ""
echo "🔧 Correções implementadas:"
echo "   ✅ Versão simplificada da aplicação para produção"
echo "   ✅ Detecção automática de ambiente"
echo "   ✅ Fallback para versão funcional sempre disponível"
echo "   ✅ Sistema anti-tela-branca"
echo "   ✅ Login simplificado que sempre funciona"

echo ""
echo "📋 Próximos passos:"
echo "   1. Fazer upload da pasta dist/ para o servidor"
echo "   2. Testar a aplicação no browser"
echo "   3. Verificar que já não há tela branca"
echo "   4. Confirmar que o login funciona"

echo ""
echo "🎉 Deploy preparado com sucesso!"
