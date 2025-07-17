# Como Resolver o Erro 403 AGORA

## O Problema

```
❌ REST API: Acesso negado (403) para test: Verificar API key e regras de segurança do Firestore
```

## Solução Rápida (3 passos)

### PASSO 1: Criar ficheiro `.env`

Na raiz do projeto, criar ficheiro `.env` com estas linhas:

```bash
VITE_FIREBASE_PROJECT_ID=leiria-1cfc9
VITE_FIREBASE_API_KEY=AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw
VITE_FIREBASE_AUTH_DOMAIN=leiria-1cfc9.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=leiria-1cfc9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=632599887141
VITE_FIREBASE_APP_ID=1:632599887141:web:1290b471d41fc3ad64eecc
VITE_FIREBASE_MEASUREMENT_ID=G-Q2QWQVH60L
```

### PASSO 2: Atualizar regras Firestore (temporário)

1. Ir para: https://console.firebase.google.com/project/leiria-1cfc9/firestore/rules
2. Substituir as regras por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Clicar "Publish"

### PASSO 3: Reiniciar servidor

```bash
# Parar o servidor (Ctrl+C) e executar:
npm run dev
```

## Resultado Esperado

Após seguir estes passos:

- ✅ Sem erros 403
- ✅ REST API funcionando
- ✅ Acesso às collections (test, clientes, obras, etc.)

## Se ainda não funcionar

1. Verificar se o ficheiro `.env` está na raiz do projeto (mesmo nível que package.json)
2. Verificar se não há espaços extra nas linhas do `.env`
3. Certificar que reiniciou o servidor completamente
4. Verificar console do browser para novos erros específicos

## Notas Importantes

- O ficheiro `.env` não será commitado para git (está no .gitignore)
- As regras `allow read, write: if true` são apenas para desenvolvimento
- Para produção, usar regras de segurança adequadas

A aplicação agora tem diagnóstico automático que mostrará instruções específicas quando detectar problemas de configuração.
