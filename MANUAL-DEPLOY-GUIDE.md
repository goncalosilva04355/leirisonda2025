# Guia de Deploy Manual - Leirisonda na Netlify

## ✅ Build Local Completo

O build foi realizado com sucesso:

- ✅ 1954 módulos transformados
- ✅ Chunks gerados corretamente
- ✅ CSS e JS otimizados
- ✅ Pasta `dist/` pronta para deploy

## 🚀 Como Fazer Deploy Manual

### Opção 1: Drag & Drop na Netlify

1. **Acesse**: https://app.netlify.com/
2. **Login** na sua conta Netlify
3. **Arraste** a pasta `dist/` para a área de deploy
4. **Aguarde** o upload e processamento

### Opção 2: Deploy via CLI

```bash
# Instalar Netlify CLI (se não tiver)
npm install -g netlify-cli

# Fazer login
netlify login

# Deploy direto da pasta dist
netlify deploy --dir=dist --prod
```

## ⚙️ Configurações Necessárias na Netlify

### 1. Site Settings > Environment Variables

Adicionar estas variáveis:

```
VITE_FIREBASE_API_KEY=AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw
VITE_FIREBASE_AUTH_DOMAIN=leiria-1cfc9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=leiria-1cfc9
VITE_FIREBASE_STORAGE_BUCKET=leiria-1cfc9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=632599887141
VITE_FIREBASE_APP_ID=1:632599887141:web:1290b471d41fc3ad64eecc
NETLIFY=true
VITE_IS_NETLIFY=true
```

### 2. Site Settings > Build & Deploy

- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 20

## 🔍 Verificação Pós-Deploy

Após o deploy, verificar no console do browser:

### ✅ Sinais de Sucesso:

```
🔥 Firebase ATIVO - rodando no Netlify ou forçado
✅ Firebase inicializado com sucesso no Netlify
🔍 Project ID ativo: leiria-1cfc9
```

### ❌ Possíveis Erros:

```
❌ Erro ao inicializar Firebase no Netlify
🚫 Firebase DESATIVADO - não está no Netlify
```

## 🐛 Troubleshooting

### Se a página não carregar:

1. **Verificar Console**: F12 → Console → procurar erros
2. **Verificar Netlify Logs**: Site Settings → Functions → View logs
3. **Limpar Cache**: Netlify → Deploys → Clear cache and deploy

### Se Firebase não funcionar:

1. **Verificar Variáveis**: Site Settings → Environment variables
2. **Redeployar**: Com as variáveis configuradas
3. **Verificar Project ID**: Deve ser `leiria-1cfc9`

## 📱 Teste da Aplicação

Após deploy bem-sucedido:

1. **Aceder ao URL** da aplicação
2. **Fazer login** com: gongonsilva@gmail.com / 19867gsf
3. **Verificar** se dados carregam corretamente
4. **Testar** criação de obras/piscinas/manutenções

## 🎯 Próximos Passos

1. ✅ Configurar variáveis de ambiente na Netlify
2. ✅ Fazer deploy manual
3. ✅ Testar funcionalidade completa
4. ✅ Configurar domínio personalizado (opcional)

## 📞 Suporte

Se encontrar problemas:

- Verificar logs da Netlify
- Verificar console do browser
- Confirmar variáveis de ambiente
