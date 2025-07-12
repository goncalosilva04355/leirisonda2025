# 🔥 Guia de Sincronização Firebase

## Como deixar a app de desenvolvimento igual à app publicada

### 📊 **Status Atual**

- **App Development**: ❌ Firestore não funcional (leitura/escrita bloqueada)
- **App Publicada**: ✅ Totalmente funcional
- **Projeto Firebase**: `leiria-1cfc9` (correto)

---

## 🔍 **Diagnóstico do Problema**

A app de desenvolvimento está configurada corretamente, mas há **3 problemas principais**:

### 1. **Regras Firestore Restritivas** 🚨

- O Firestore está configurado com regras de produção que bloqueiam acesso
- A app publicada provavelmente tem regras diferentes ou foi configurada antes

### 2. **Conflitos de Configuração** ⚠️

- Existem referências a dois projetos Firebase:
  - `leiria-1cfc9` (atual e correto)
  - `leirisonda-16f8b` (antigo, deve ser removido)

### 3. **Problemas de Compatibilidade iOS/Safari** 🍎

- Firebase tem limitações conhecidas no Safari
- Necessário error handling específico

---

## ✅ **Soluções Implementadas**

### 1. **Configuração Unificada**

```typescript
// src/firebase/configValidator.ts
export const OFFICIAL_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
};
```

### 2. **Compatibilidade Safari**

- Serviço dedicado para iOS/Safari: `SafariCompatibilityService`
- Error handling robusto para operações Firebase
- Fallbacks automáticos quando necessário

---

## 🛠️ **AÇÕES NECESSÁRIAS**

### **Passo 1: Configurar Regras Firestore** ⭐ **PRIORITÁRIO**

1. **Abrir Firebase Console**:

   ```
   https://console.firebase.google.com/project/leiria-1cfc9/firestore/rules
   ```

2. **Substituir regras atuais por estas** (temporário para desenvolvimento):

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // REGRAS DE DESENVOLVIMENTO - Permitir tudo
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

3. **Clicar "Publish"** para aplicar

### **Passo 2: Verificar Status**

1. Voltar à app de desenvolvimento
2. No componente de status Firestore (acima do logo), clicar "Verificar"
3. Deve mostrar ✅ para Disponível, Leitura e Escrita

### **Passo 3: Testar Funcionalidade**

1. Tentar fazer login
2. Criar dados (obras, manutenções, etc.)
3. Verificar sincronização entre dispositivos

---

## 🔄 **Sincronização Contínua**

### **Variáveis de Ambiente** (Opcional)

Para ambientes diferentes, pode criar:

**.env.development**:

```
VITE_FIREBASE_PROJECT_ID=leiria-1cfc9
VITE_FIREBASE_API_KEY=AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw
VITE_ENVIRONMENT=development
```

**.env.production**:

```
VITE_FIREBASE_PROJECT_ID=leiria-1cfc9
VITE_FIREBASE_API_KEY=AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw
VITE_ENVIRONMENT=production
```

### **Deploy Automático**

O projeto já está configurado para Netlify:

```toml
[build]
command = "npm run build"
publish = "dist"

[build.environment]
NODE_VERSION = "20"
```

---

## 🚨 **Segurança para Produção**

**Antes de ir para produção**, alterar regras Firestore para:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Requer autenticação para todas as operações
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /{collection}/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📱 **Notas Específicas iOS/Safari**

### **Limitações Conhecidas**:

- **Storage**: Dados podem ser limpos após 7 dias de inatividade (ITP)
- **Private Browsing**: localStorage/sessionStorage limitados
- **IndexedDB**: Inconsistências no Safari

### **Soluções Implementadas**:

- Detecção automática de Safari/iOS
- Retry automático com backoff exponencial
- Fallbacks para modo local quando necessário

---

## ✅ **Checklist Final**

- [ ] **Regras Firestore configuradas** (Passo 1)
- [ ] **Status mostra ✅ para tudo**
- [ ] **Login funciona**
- [ ] **Dados sincronizam**
- [ ] **App comporta-se igual em dev e prod**

---

## 🆘 **Se ainda não funcionar**

1. **Limpar cache do browser** (Ctrl+F5)
2. **Testar em modo incógnito**
3. **Verificar console browser** para erros específicos
4. **Usar o botão "Corrigir Regras"** no componente de status

---

**📧 Contacto**: Se precisar de ajuda adicional, o componente de status Firestore tem links diretos para o Firebase Console e instruções específicas.
