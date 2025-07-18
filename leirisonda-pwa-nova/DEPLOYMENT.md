# 🚀 Deployment Guide - Leirisonda PWA Nova

## ✅ Pré-requisitos

Esta PWA está **100% pronta** para deployment! Inclui:

- ✅ Build configurada (`npm run build`)
- ✅ Netlify.toml configurado
- ✅ Headers e redirects para PWA
- ✅ Service Worker configurado
- ✅ Manifest.json optimizado
- ✅ Firebase REST API funcional

## 🌐 Deploy no Netlify

### Opção 1: Netlify Drop (Mais Rápido)

1. **Fazer build:**

   ```bash
   cd leirisonda-pwa-nova
   npm install
   npm run build
   ```

2. **Upload para Netlify:**
   - Vai a: https://app.netlify.com/drop
   - Arrasta a pasta `dist/`
   - Aguarda 2-3 minutos
   - ✅ PWA online!

### Opção 2: GitHub + Netlify (Recomendado para produção)

1. **Push para GitHub:**

   ```bash
   cd leirisonda-pwa-nova
   git init
   git add .
   git commit -m "🚀 Leirisonda PWA Nova - Ready for deployment"
   git branch -M main
   git remote add origin [SEU_REPO_URL]
   git push -u origin main
   ```

2. **Conectar ao Netlify:**
   - Dashboard Netlify → "New site from Git"
   - Conectar GitHub repository
   - Settings automáticas (netlify.toml configurado)
   - Deploy automático!

## 📱 Verificações Pós-Deploy

Após deploy, verificar:

- ✅ **PWA Install Banner** aparece no mobile
- ✅ **Login funcional**: `gongonsilva@gmail.com` / `19867gsf`
- ✅ **Firestore REST API** conecta automaticamente
- ✅ **Service Worker** registado (DevTools → Application)
- ✅ **Manifest** válido (Lighthouse PWA score)

## 🔧 Configurações Netlify

O arquivo `netlify.toml` já configura:

- **Build**: `npm run build`
- **Publish**: `dist/`
- **Redirects**: SPA routing suportado
- **Headers**: PWA e security headers
- **Service Worker**: Configuração correta

## 🚨 Troubleshooting

### Service Worker não carrega

- Verificar em `yoursite.com/firebase-messaging-sw.js`
- Headers corretos já configurados

### PWA não instala

- Verificar `yoursite.com/manifest.json`
- HTTPS obrigatório (Netlify fornece automaticamente)

### Firebase não conecta

- REST API já configurada em `src/utils/firestoreRestApi.ts`
- Projeto `leiria-1cfc9` já configurado

## 📊 Performance

Build otimizada inclui:

- **Code Splitting**: Chunks separados por vendor
- **Tree Shaking**: Dependências não utilizadas removidas
- **Minificação**: esbuild para builds rápidas
- **Lazy Loading**: Componentes carregados sob demanda

## 🎯 URL Final

Após deploy no Netlify:

- **URL temporário**: `https://random-name-123.netlify.app`
- **Domínio custom**: Configurável no Netlify Dashboard

---

## ⚡ Deploy Rápido (1-click)

```bash
# 1. Build
cd leirisonda-pwa-nova && npm run build

# 2. Upload dist/ para Netlify Drop
# https://app.netlify.com/drop

# 3. ✅ PWA Online!
```

**🎉 PWA totalmente funcional em menos de 5 minutos!**
