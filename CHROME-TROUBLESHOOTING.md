# 🔧 Troubleshooting Chrome - leirisonda2025.netlify.app

## ✅ Correções Implementadas

### 1. **Service Worker Corrigido**

- `/public/firebase-messaging-sw.js` atualizado com configuração Firebase Leiria
- Fallback gracioso se Firebase não estiver disponível
- Compatibilidade melhorada com Chrome

### 2. **Manifest.json Corrigido**

- Ícones locais em vez de URLs externas
- Configuração PWA otimizada
- Orientação flexível

### 3. **Headers HTTP Otimizados**

- `X-Frame-Options: SAMEORIGIN` (menos restritivo)
- Headers específicos para service worker
- Cache otimizado

### 4. **Configuração Netlify Melhorada**

- Redirects SPA corretos
- Headers específicos no `netlify.toml`
- Node.js v20

### 5. **Debug Script Adicionado**

- `/public/debug-chrome.js` para diagnosticar problemas
- Logs detalhados no console do Chrome

## 🔍 Como Verificar se Funcionou

### No Chrome DevTools (F12):

1. **Console** - deve mostrar:

   ```
   🔍 Debug Chrome iniciado
   Chrome detectado: true
   HTTPS: true
   ✅ Service Worker suportado
   ✅ localStorage funcional
   ✅ App React carregada
   ```

2. **Application > Service Workers** - deve mostrar:

   - `firebase-messaging-sw.js` registado
   - Status: `activated and is running`

3. **Network** - verificar se não há erros 404/500

4. **Manifest** - deve mostrar PWA válida

## 🚨 Problemas Comuns e Soluções

### Se ainda não funcionar:

1. **Limpar Cache Chrome**:

   - `Ctrl+Shift+R` (hard refresh)
   - DevTools > Application > Storage > Clear storage

2. **Verificar HTTPS**:

   - Site deve estar em `https://`
   - Certificado SSL válido

3. **Modo Incógnito**:

   - Testar em nova janela incógnita
   - Verificar se extensões interferem

4. **Verificar Console**:
   - Procurar erros vermelhos
   - Verificar se Firebase carrega

## 📱 Deploy Status

- **Netlify**: Deploy automático quando código atualizado
- **URL**: https://leirisonda2025.netlify.app
- **Build**: Node.js 20, Vite build

## 🔄 Próximos Passos se Problema Persistir

1. Verificar logs Netlify
2. Testar noutros browsers (Firefox, Edge)
3. Verificar se problema é específico do Chrome ou geral
4. Verificar DNS/conectividade

---

**Status**: ✅ Correções aplicadas - deve funcionar no Chrome
