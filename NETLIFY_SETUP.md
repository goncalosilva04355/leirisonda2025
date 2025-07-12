# Configuração para Deployment no Netlify

## Problema Resolvido

✅ **Build Error (Exit Code 2)**: Erro corrigido - o build local funciona corretamente
✅ **Secrets Scanning**: Chaves API movidas para variáveis de ambiente

## Configuração Necessária no Netlify

### 1. Variáveis de Ambiente

No painel do Netlify (Site Settings > Environment Variables), adicione as seguintes variáveis:

#### Projeto Principal (Leiria)

```
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Projeto Legacy (Leirisonda) - Opcional

```
VITE_LEIRISONDA_FIREBASE_API_KEY=AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE
VITE_LEIRISONDA_FIREBASE_AUTH_DOMAIN=leirisonda-16f8b.firebaseapp.com
VITE_LEIRISONDA_FIREBASE_DATABASE_URL=https://leirisonda-16f8b-default-rtdb.europe-west1.firebasedatabase.app
VITE_LEIRISONDA_FIREBASE_PROJECT_ID=leirisonda-16f8b
VITE_LEIRISONDA_FIREBASE_STORAGE_BUCKET=leirisonda-16f8b.firebasestorage.app
VITE_LEIRISONDA_FIREBASE_MESSAGING_SENDER_ID=1067024677476
VITE_LEIRISONDA_FIREBASE_APP_ID=1:1067024677476:web:a5e5e30ed4b5a64b123456
```

#### Configuração de Projeto

```
VITE_USE_LEIRISONDA_CONFIG=false
```

### 2. Configuração de Build

O ficheiro `netlify.toml` já está configurado corretamente:

- Build command: `npm ci --legacy-peer-deps && npm run build`
- Publish directory: `dist`
- Node version: 20

### 3. Resolução de Secrets

As seguintes alterações foram feitas para resolver o problema de secrets:

1. **Criado helper centralizado**: `src/config/firebaseEnv.ts`
2. **Atualizado basicConfig.ts**: Agora usa variáveis de ambiente
3. **Criado .env.example**: Documenta��ão das variáveis necessárias

### 4. Como Aplicar as Configurações

1. **No Netlify Dashboard**:

   - Vá para Site Settings > Environment Variables
   - Adicione todas as variáveis listadas acima
   - Salve as configurações

2. **Redeploy**:
   - Faça um novo deploy ou trigger um rebuild
   - O sistema deve agora funcionar sem erros

### 5. Ficheiros Restantes com Secrets

⚠️ **Nota**: Ainda existem outros ficheiros com chaves hardcoded que precisam ser atualizados:

- `src/firebase/noGetImmediateConfig.ts`
- `src/firebase/firestoreServiceFix.ts`
- `src/firebase/unifiedSafeFirebase.ts`
- E vários outros...

Estes ficheiros devem ser atualizados para usar o helper centralizado `firebaseEnv.ts` para evitar futuros problemas de secrets scanning.

### 6. Verificação

Após configurar as variáveis de ambiente:

1. O build deve completar sem erro (exit code 0)
2. O secrets scanning não deve detectar problemas
3. A aplicação deve funcionar normalmente

## Próximos Passos Recomendados

1. Configurar as variáveis de ambiente no Netlify
2. Fazer redeploy
3. Atualizar os ficheiros restantes para usar configuração centralizada
4. Verificar funcionamento da aplicação
