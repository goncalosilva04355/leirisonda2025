# 🔑 Instruções de Login - Leirisonda

## ✅ **Credenciais de Login:**

- **Email:** `gongonsilva@gmail.com`
- **Password:** `19867gsf` ou `123`

## ⚠️ **Problema Atual:**

A aplicação no Netlify mostra **"Firestore indisponível (modo local)"** porque a configuração do Firebase não está com as credenciais reais.

## 🔧 **Como Resolver:**

### **Opção 1: Login Simples (Funciona Imediatamente)**

1. Use email: `gongonsilva@gmail.com`
2. Use password: `123`
3. O sistema funcionará em modo local

### **Opção 2: Configurar Firebase Real**

1. Vá à Firebase Console: https://console.firebase.google.com
2. Obtenha as configurações do projeto real
3. Substitua em `src/config/firebaseEnv.ts` as credenciais fictícias

## 📱 **Status Atual:**

- ✅ Login funciona com `123`
- ✅ Sistema funciona em modo local
- ⚠️ Firebase precisa de configuração real para sincronização

## 🎯 **Próximo Passo:**

Use as credenciais acima para fazer login e depois configuramos o Firebase se necessário.
