# 🔐 Configuração de Segurança - Leirisonda

## ⚠️ IMPORTANTE - Credenciais Removidas

Todas as credenciais sensíveis foram removidas do código por segurança. Agora é necessário configurar variáveis de ambiente.

## 🚀 Configuração Rápida

### 1. Criar ficheiro `.env`

Copie o ficheiro `.env.example` para `.env` e preencha com as suas credenciais:

```bash
cp .env.example .env
```

### 2. Configurar Firebase

No ficheiro `.env`, adicione as suas credenciais Firebase:

```env
# Firebase Principal
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Firebase Leirisonda (Legacy)
VITE_LEIRISONDA_FIREBASE_API_KEY=your_leirisonda_api_key
VITE_LEIRISONDA_FIREBASE_AUTH_DOMAIN=leirisonda-16f8b.firebaseapp.com
VITE_LEIRISONDA_FIREBASE_PROJECT_ID=leirisonda-16f8b
VITE_LEIRISONDA_FIREBASE_STORAGE_BUCKET=leirisonda-16f8b.firebasestorage.app
VITE_LEIRISONDA_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_LEIRISONDA_FIREBASE_APP_ID=your_app_id
```

### 3. Configurar Builder.io

```env
BUILDER_API_KEY=your_builder_api_key
```

### 4. Configurar Credenciais Admin (Desenvolvimento)

```env
VITE_ADMIN_EMAIL=your_admin_email
VITE_ADMIN_NAME=Your Name
VITE_ADMIN_PASSWORD=your_secure_password
```

## 🔄 Onde Obter as Credenciais

### Firebase

1. Aceda ao [Firebase Console](https://console.firebase.google.com/)
2. Selecione o seu projeto
3. Vá a **Configurações do Projeto** → **Geral**
4. Copie os valores da configuração SDK

### Builder.io

1. Aceda ao [Builder.io](https://builder.io/)
2. Vá a **Account Settings** → **API Keys**
3. Copie a sua API Key

## 🛡️ Segurança

- ✅ O ficheiro `.env` está no `.gitignore` e nunca será commitado
- ✅ Todas as credenciais hardcoded foram removidas
- ✅ O sistema usa variáveis de ambiente seguras
- ✅ Fallbacks estão configurados para desenvolvimento

## 🚨 Para Deployment

### Netlify

Configure as variáveis de ambiente no painel Netlify:

1. Site Settings → Environment Variables
2. Adicione todas as variáveis do `.env`

### Vercel

```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
# ... etc
```

### GitHub Actions

Configure nos Secrets do repositório:

1. Settings → Secrets and Variables → Actions
2. Adicione cada variável como secret

## 🔧 Verificação

Após configurar, teste se funciona:

```bash
npm run dev
```

A aplicação deve iniciar sem erros de configuração Firebase.

## 📞 Suporte

Se tiver problemas:

1. Verifique se todas as variáveis estão no `.env`
2. Confirme que os valores não têm espaços extras
3. Reinicie o servidor de desenvolvimento

---

**NUNCA** comite ficheiros com credenciais. Use sempre variáveis de ambiente!
