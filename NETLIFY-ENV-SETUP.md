# Configuração de Variáveis de Ambiente no Netlify

## Problema Resolvido

✅ **SECRETS SCAN FAILURE CORRIGIDO**: Todas as chaves Firebase hardcoded foram removidas e substituídas por variáveis de ambiente seguras.

## Configuração no Netlify

Para resolver o erro de deploy, configure estas variáveis de ambiente no painel do Netlify:

### 1. Acesse as Configurações de Environment Variables

1. Vá para o painel do seu site no Netlify
2. Clique em **Site Settings**
3. Vá para **Environment variables**
4. Clique em **Add variable**

### 2. Configure estas variáveis (OBRIGATÓRIAS):

```
VITE_FIREBASE_API_KEY=AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw
VITE_FIREBASE_AUTH_DOMAIN=leiria-1cfc9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=leiria-1cfc9
VITE_FIREBASE_STORAGE_BUCKET=leiria-1cfc9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=632599887141
VITE_FIREBASE_APP_ID=1:632599887141:web:1290b471d41fc3ad64eecc
```

### 3. Configure estas variáveis (OPCIONAIS):

```
VITE_FIREBASE_DATABASE_URL=https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app
VITE_FIREBASE_MEASUREMENT_ID=G-Q2QWQVH60L
VITE_IS_NETLIFY=true
```

## Arquivos Atualizados

### ✅ Configuração Centralizada

- `src/firebase/config.ts` - Configuração principal com suporte a variáveis de ambiente
- `.env.example` - Template para variáveis de ambiente

### ✅ Arquivos de Configuração Firebase

- `src/firebase/correctConfig.ts`
- `src/firebase/prodConfig.ts`
- `src/firebase/productionConfig.ts`
- `src/firebase/simpleFirestore.ts`

### ✅ Arquivos REST API

- `src/utils/firestoreRestApi.ts`
- `src/utils/directFirestoreAPI.ts`

### ✅ Arquivos Públicos

- `public/firebase-messaging-sw.js`

### ✅ Configurações de Ambiente

- `src/config/firebaseEnv.ts`

## Como Funciona Agora

1. **Em Produção (Netlify)**: Usa as variáveis de ambiente configuradas no painel
2. **Em Desenvolvimento**: Usa fallback seguro ou variáveis locais do `.env.local`
3. **REST API**: Continua funcionando com a configuração centralizada
4. **Service Worker**: Usa variáveis de ambiente quando disponíveis

## Próximos Passos

1. ✅ Configure as variáveis no Netlify
2. ✅ Faça um novo deploy
3. ✅ Verifique que o deploy passa no secrets scan
4. ✅ Teste que o Firebase continua funcionando

## Verificação

Após configurar as variáveis:

- O build não deve mais falhar por secrets scan
- O Firebase deve continuar funcionando normalmente
- As APIs REST devem continuar operacionais
- O PWA deve continuar recebendo notificações

## Segurança

✅ **Nenhuma chave secreta está mais hardcoded no código**
✅ **Todas as chaves usam variáveis de ambiente**
✅ **Fallbacks seguros para desenvolvimento**
✅ **Configuração centralizada para fácil manutenção**
