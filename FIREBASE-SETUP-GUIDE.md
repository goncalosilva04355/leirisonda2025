# 🔥 Guia de Configuração Firebase - Leirisonda

## Passo 1: Criar Projeto Firebase

1. **Aceda à Firebase Console:**

   - Vá a: https://console.firebase.google.com
   - Faça login com a sua conta Google (gongonsilva@gmail.com)

2. **Criar Novo Projeto:**
   - Clique em "Add project" (Adicionar projeto)
   - Nome do projeto: `leirisonda-2024` ou `leirisonda-prod`
   - ✅ Aceitar termos Firebase
   - ✅ Ativar Google Analytics (opcional mas recomendado)
   - Clique "Create project"

## Passo 2: Configurar Authentication

1. **No painel esquerdo, clique em "Authentication"**
2. **Clique "Get started"**
3. **Vá ao tab "Sign-in method"**
4. **Ative "Email/Password":**
   - Clique em "Email/Password"
   - ✅ Enable "Email/Password"
   - ❌ Deixe "Email link" desativado
   - Clique "Save"

## Passo 3: Configurar Firestore Database

1. **No painel esquerdo, clique em "Firestore Database"**
2. **Clique "Create database"**
3. **Escolher regras:**
   - Selecione "Start in production mode" (mais seguro)
   - Clique "Next"
4. **Escolher localização:**
   - Selecione "europe-west1 (Belgium)" ou "europe-west3 (Frankfurt)"
   - Clique "Done"

## Passo 4: Obter Configurações

1. **Vá para "Project Settings" (ícone da engrenagem)**
2. **Na secção "Your apps", clique no ícone Web (</> )**
3. **Registar a aplicação:**

   - App nickname: `Leirisonda Web App`
   - ✅ Marque "Also set up Firebase Hosting" (opcional)
   - Clique "Register app"

4. **Copiar configurações Firebase:**

```javascript
// As suas configurações aparecerão assim:
const firebaseConfig = {
  apiKey: "AIzaSy....", // COPIE ESTE VALOR
  authDomain: "leirisonda-2024.firebaseapp.com", // COPIE ESTE VALOR
  projectId: "leirisonda-2024", // COPIE ESTE VALOR
  storageBucket: "leirisonda-2024.appspot.com", // COPIE ESTE VALOR
  messagingSenderId: "123456789", // COPIE ESTE VALOR
  appId: "1:123456789:web:abc123", // COPIE ESTE VALOR
  measurementId: "G-XXXXXXXXXX", // COPIE ESTE VALOR
};
```

## Passo 5: Configurar Regras de Segurança

1. **Volte ao Firestore Database**
2. **Clique no tab "Rules"**
3. **Substitua as regras por:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Authenticated users can access obras, manutencoes, piscinas, clientes
    match /{collection=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. **Clique "Publish"**

## ✅ Quando terminar:

**Envie-me as configurações Firebase** que copiou no Passo 4, e eu configuro automaticamente o código!

Exemplo do que preciso:

- apiKey: "AIzaSy...."
- authDomain: "leirisonda-2024.firebaseapp.com"
- projectId: "leirisonda-2024"
- storageBucket: "leirisonda-2024.appspot.com"
- messagingSenderId: "123456789"
- appId: "1:123456789:web:abc123"
- measurementId: "G-XXXXXXXXXX"

---

## 📋 Checklist de Verificação:

- [ ] Projeto Firebase criado
- [ ] Authentication configurado (Email/Password)
- [ ] Firestore Database criado
- [ ] Regras de segurança configuradas
- [ ] Configurações copiadas e enviadas

**Depois disso, a sincronização entre dispositivos será restaurada automaticamente!**
