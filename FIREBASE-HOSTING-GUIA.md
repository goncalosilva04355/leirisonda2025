# 🔥 Guia Completo - Firebase Hosting Deploy

## ❌ Problema Atual

Não consegue fazer deploy no Firebase Hosting porque precisa autenticação interativa.

## ✅ Soluções Disponíveis

### **Opção 1: Deploy Manual Firebase (Recomendado)**

1. **No seu computador local, abra terminal e execute:**

   ```bash
   # Instalar Firebase CLI (apenas uma vez)
   npm install -g firebase-tools

   # Fazer login no Firebase
   firebase login

   # Selecionar projeto
   firebase use leiria-1cfc9

   # Fazer deploy
   firebase deploy --only hosting
   ```

2. **Resultado:**
   - Site online em: `https://leiria-1cfc9.web.app`
   - Deploy em 1-2 minutos

### **Opção 2: Netlify Drop (Mais Simples)**

1. **Baixa a pasta `dist`** do teu projeto
2. **Vai a:** `https://app.netlify.com/drop`
3. **Arrasta a pasta `dist`** para a página
4. **Site online em 30 segundos!**

### **Opção 3: Deploy via Interface Firebase**

1. **Vai a:** `https://console.firebase.google.com`
2. **Seleciona projeto:** `leiria-1cfc9`
3. **Hosting** → **Deploy**
4. **Upload pasta `dist`**

---

## 🔧 Estado Atual do Projeto

✅ **Build funcionando:** `npm run build` cria pasta `dist`  
✅ **Firebase configurado:** Projeto `leiria-1cfc9`  
✅ **firebase.json** configurado corretamente  
❌ **Firebase CLI** precisa login interativo

---

## 📱 Scripts Disponíveis

```bash
# Criar build
npm run build

# Deploy Firebase (depois do login)
npm run firebase:deploy
```

---

## 🎯 Recomendação

**Use Netlify Drop** para deploy rápido:

1. `npm run build`
2. Baixa pasta `dist`
3. https://app.netlify.com/drop
4. ✅ Site online!

**Tempo total:** 2 minutos  
**Custo:** GRÁTIS
