# Configuração do Projeto Firebase Ativo - leiria-1cfc9

## ⚠️ IMPORTANTE

O projeto antigo `leirisonda-16f8b` foi apagado. O projeto ativo é `leiria-1cfc9`.

## 🔧 Configuração Necessária

Para que o Firestore funcione corretamente, você precisa atualizar o arquivo `.env.local` com as credenciais corretas do projeto `leiria-1cfc9`.

### 1. Obter Credenciais Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto **leiria-1cfc9**
3. Vá em **Configurações do Projeto** (⚙️)
4. Na aba **Geral**, role até **Seus apps**
5. Clique em **Configuração** (ícone de engrenagem) no app web
6. Copie as credenciais da seção **Configuração do SDK**

### 2. Atualizar .env.local

Substitua as credenciais no arquivo `.env.local`:

```env
# Forçar Firebase/Firestore em desenvolvimento
VITE_FORCE_FIREBASE=true

# Variáveis Firebase para desenvolvimento - Projeto ativo leiria-1cfc9
VITE_FIREBASE_API_KEY=SUA_API_KEY_AQUI
VITE_FIREBASE_AUTH_DOMAIN=leiria-1cfc9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=leiria-1cfc9
VITE_FIREBASE_STORAGE_BUCKET=leiria-1cfc9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_SENDER_ID_AQUI
VITE_FIREBASE_APP_ID=SEU_APP_ID_AQUI
VITE_FIREBASE_MEASUREMENT_ID=SEU_MEASUREMENT_ID_AQUI
```

### 3. Verificar Firestore

1. No Firebase Console, vá para **Firestore Database**
2. Se não estiver criado, clique em **Criar base de dados**
3. Escolha **Modo de teste** inicialmente
4. Selecione uma localização (preferencialmente `eur3` - Europa)

### 4. Reiniciar Aplicação

Após atualizar as credenciais:

1. Pare o servidor de desenvolvimento (Ctrl+C)
2. Reinicie com `npm run dev`
3. Teste usando o componente "Teste do Firestore" na dashboard

## 🔍 Diagnóstico

Se ainda houver problemas, verifique:

1. Credenciais corretas no `.env.local`
2. Firestore habilitado no projeto
3. Regras de segurança (mode de teste permite leitura/escrita)
4. Console do navegador para mensagens de erro específicas

## 📝 Status Atual

- ✅ Código atualizado para projeto `leiria-1cfc9`
- ⚠️ Credenciais necessárias no `.env.local`
- 🔄 Firestore será testado após configuração das credenciais
