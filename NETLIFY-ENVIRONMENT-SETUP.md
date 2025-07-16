# Configuração do Netlify - Leirisonda

## Variáveis de Ambiente Necessárias

Para que a aplicação funcione corretamente na Netlify, é necessário configurar as seguintes variáveis de ambiente no painel do Netlify:

### 1. Firebase - Projeto leiria-1cfc9

```
VITE_FIREBASE_API_KEY=AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw
VITE_FIREBASE_AUTH_DOMAIN=leiria-1cfc9.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=leiria-1cfc9
VITE_FIREBASE_STORAGE_BUCKET=leiria-1cfc9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=632599887141
VITE_FIREBASE_APP_ID=1:632599887141:web:1290b471d41fc3ad64eecc
VITE_FIREBASE_MEASUREMENT_ID=G-Q2QWQVH60L
```

### 2. Build Configuration

```
NETLIFY=true
VITE_IS_NETLIFY=true
NODE_VERSION=20
NETLIFY_NEXT_PLUGIN_SKIP=true
```

## Como Configurar no Netlify

1. Acesse o painel do Netlify
2. Vá em **Site Settings** > **Environment Variables**
3. Adicione cada variável listada acima
4. Faça um novo deploy

## Verificação

Após o deploy, verifique nos logs se aparecem as mensagens:

- ✅ Firebase ATIVO - rodando no Netlify ou forçado
- ✅ Firebase inicializado com sucesso no Netlify
- 🔍 Project ID ativo: leiria-1cfc9

## Build Commands

O `netlify.toml` já está configurado corretamente:

- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`

## Troubleshooting

Se a aplicação não carregar:

1. **Verificar Logs**: Procurar por erros de Firebase nos logs do deploy
2. **Variáveis**: Confirmar que todas as variáveis estão definidas
3. **Cache**: Limpar cache do build e fazer novo deploy
4. **Manual Deploy**: Usar drag & drop do `dist/` folder

## Status Atual

- ✅ Configuração básica do Firebase corrigida
- ✅ Build local funcionando
- ⏳ Aguardando configuração das variáveis no Netlify
- ⏳ Deploy manual para teste
