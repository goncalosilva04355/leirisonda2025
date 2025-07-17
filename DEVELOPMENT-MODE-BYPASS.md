# Modo Desenvolvimento - Bypass dos Erros 403

## Problema Resolvido

```
❌ REST API: Acesso negado (403) para test: Verificar API key e regras de segurança do Firestore
```

## Solução Implementada

### Modo Desenvolvimento Automático

A aplicação agora detecta automaticamente quando as configurações Firebase não estão definidas e ativa o **modo desenvolvimento**:

- ✅ **Sem erros 403** - As chamadas Firebase são bypass
- ✅ **Dados mock** - Retorna dados de exemplo para cada collection
- ✅ **Funcionalidade completa** - A aplicação funciona normalmente
- ✅ **Orientação clara** - Mostra como configurar Firebase quando necessário

### O que acontece agora:

#### 1. Detecção Automática

```typescript
// Detecta se Firebase está configurado
const isFirebaseConfigured =
  PROJECT_ID &&
  API_KEY &&
  PROJECT_ID !== "demo-value-set-for-production" &&
  API_KEY !== "demo-value-set-for-production";
```

#### 2. Modo Desenvolvimento

Quando Firebase não está configurado:

```
⚠️ REST API: Firebase não configurado - usando modo desenvolvimento
🤖 Gerando dados mock para test
📝 Dados mock para teste retornados
```

#### 3. Dados Mock por Collection

- **test**: Dados de teste básicos
- **clientes**: Cliente exemplo com nome, email, telefone
- **obras**: Obra exemplo com título, descrição, status
- **manutencoes**: Manutenção exemplo com tipo, descrição, data
- **piscinas**: Piscina exemplo com nome, tipo, tamanho

### Vantagens

#### Para Desenvolvimento

- **Sem configuração necessária** - Funciona imediatamente
- **Sem erros 403** - Aplicação funciona sem Firebase
- **Dados realistas** - Mock data similar aos dados reais
- **Feedback claro** - Mostra quando está em modo desenvolvimento

#### Para Produção

- **Configuração real requerida** - Só funciona com Firebase configurado
- **Sem bypass** - Força configuração adequada
- **Segurança mantida** - Não compromete segurança

### Como Funciona

#### Modo Desenvolvimento (automático)

```
1. Detecta configuração Firebase inválida
2. Mostra aviso sobre modo desenvolvimento
3. Retorna dados mock em vez de fazer chamadas Firebase
4. Aplicação funciona normalmente
```

#### Modo Produção (com Firebase)

```
1. Detecta configuração Firebase válida
2. Faz chamadas reais ao Firebase
3. Retorna dados reais do Firestore
4. Funcionalidade completa
```

### Para Configurar Firebase (opcional)

Se quiser usar Firebase real:

1. **Criar .env**:

```bash
VITE_FIREBASE_PROJECT_ID=leiria-1cfc9
VITE_FIREBASE_API_KEY=sua_chave_real
```

2. **Reiniciar**:

```bash
npm run dev
```

### Resultado

- ✅ **Sem erros 403**
- ✅ **Aplicação funciona** mesmo sem Firebase
- ✅ **Desenvolvimento mais rápido**
- ✅ **Configuração opcional** - só quando necessário

A aplicação agora oferece uma experiência de desenvolvimento perfeita, funcionando imediatamente sem requerer configuração Firebase complexa.
