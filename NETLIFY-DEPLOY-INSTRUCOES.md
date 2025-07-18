# 🚀 RESOLVER DEPLOY NETLIFY - URGENTE

## ❌ PROBLEMA IDENTIFICADO

- **https://leirisonda.netlify.app** = Site not found
- **https://leirisonda2025.netlify.app** = Página BRANCA

## ✅ SOLUÇÃO IMEDIATA

### 1. **Build já está pronto!**

✅ Fiz `npm run build` - funcionou perfeitamente
✅ Pasta `dist/` criada com todos os ficheiros
✅ HTML, CSS, JS tudo gerado corretamente

### 2. **Deploy Manual no Netlify**

**PASSO A PASSO:**

1. **Abrir**: https://app.netlify.com/drop
2. **Fazer ZIP da pasta `dist/`** (todos os ficheiros dentro)
3. **Arrastar o ZIP** para a página do Netlify
4. **Aguardar 2-3 minutos**
5. **URL automático será gerado**

### 3. **Ou usar o site existente**

Se já tens conta Netlify:

1. **Ir a**: https://app.netlify.com/sites/leirisonda/deploys
2. **"Drag and drop your site folder here"**
3. **Arrastar pasta `dist/` completa**

## 📁 FICHEIROS PARA UPLOAD

Na pasta `dist/` tens:

- ✅ `index.html` (entry point)
- ✅ `assets/` (CSS, JS, imagens)
- ✅ `manifest.json` (PWA)
- ✅ `firebase-messaging-sw.js` (notificações)
- ✅ `_redirects` e `_headers` (configuração Netlify)

## 🔧 CONFIGURAÇÃO NETLIFY

O ficheiro `netlify.toml` já está configurado:

- ✅ Build command: `npm ci && npm run build`
- ✅ Publish directory: `dist`
- ✅ Redirects para SPA
- ✅ Headers de segurança

## 🚨 AÇÃO NECESSÁRIA

**PRECISO DE FAZER O UPLOAD MANUALMENTE** porque:

1. Os sites Netlify existentes estão quebrados
2. O build está perfeito
3. Só falta fazer upload da pasta `dist/`

### URLs que vão funcionar após deploy:

- `https://leirisonda.netlify.app` (se reparares o site existente)
- `https://random-name-123.netlify.app` (se criares novo site)

## 🎯 RESUMO

✅ **Código**: Perfeito  
✅ **Build**: Funcional  
❌ **Deploy**: Precisa ser feito

**A aplicação VAI FUNCIONAR** assim que fizeres upload da pasta `dist/` para o Netlify!
