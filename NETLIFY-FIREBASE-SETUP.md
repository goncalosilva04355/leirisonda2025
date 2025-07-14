# 🌐 Configuração Firebase no Netlify

## ✅ Status Atual

- **Desenvolvimento:** Firebase DESATIVADO (localStorage apenas)
- **Netlify:** Firebase será ATIVO (aguarda suas variáveis)

## 🔧 Configurar Variáveis no Netlify

### 1. **Aceder ao Netlify Dashboard**

1. Vá a [app.netlify.com](https://app.netlify.com)
2. Seleccione o seu site
3. Vá a **Site Settings** > **Environment Variables**

### 2. **Adicionar Variáveis Firebase**

Adicione cada uma destas variáveis com os valores do seu Firebase Console:

```
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=sua_app_id
```

### 3. **Obter Valores do Firebase Console**

1. Vá ao [Firebase Console](https://console.firebase.google.com)
2. Seleccione o seu projeto
3. Vá a **Project Settings** (ícone engrenagem)
4. Na secção **Your Apps**, seleccione a sua aplicação web
5. Copie os valores da configuração Firebase

### 4. **Verificar Configuração**

Após configurar, quando fizer deploy no Netlify:

- Um indicador aparecerá no canto superior direito
- Mostrará se cada variável está ✅ Configurada ou ❌ Em falta
- Firebase estará ativo automaticamente

## 🚀 Fazer Deploy

```bash
# Fazer deploy com novas variáveis
netlify deploy --prod

# Ou através do Git (se conectado)
git push origin main
```

## 🧪 Testar Localmente (Opcional)

Para testar as variáveis localmente antes do deploy:

```bash
# Executar teste de variáveis
node test-netlify-vars.js

# Configurar arquivo .env local (opcional)
cp .env.example .env
# Editar .env com os valores reais
```

## ✅ O que Esperar

### **Durante Desenvolvimento:**

- ❌ Firebase invisível
- ✅ Só localStorage
- ✅ Interface limpa

### **No Netlify (Produção):**

- ✅ Firebase ativo automaticamente
- ✅ Componentes de status visíveis
- ✅ Dados sincronizados com Firestore
- ✅ Indicador no canto superior direito

## 🆘 Resolução de Problemas

### Se vir "❌ Não definida":

1. Verifique se adicionou a variável no Netlify
2. Certifique-se que o nome está correto (VITE*FIREBASE*...)
3. Faça novo deploy após adicionar variáveis

### Se vir "⚠️ Placeholder":

1. Substitua valores como "your_api_key_here"
2. Use valores reais do Firebase Console

### Se Firebase não conectar:

1. Verifique se Firestore está ativado no Firebase Console
2. Confirme regras de segurança Firestore
3. Verifique se o domínio Netlify está autorizado no Firebase
