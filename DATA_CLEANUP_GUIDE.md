# Guia de Limpeza de Dados - Leirisonda

Este guia explica como usar a nova funcionalidade de limpeza de dados que permite eliminar todas as obras, manutenções e piscinas para começar com uma aplicação limpa, garantindo sempre que os utilizadores ficam sincronizados.

## Funcionalidades Implementadas

### 1. Serviço de Limpeza de Dados (`dataCleanupService`)

**Localização:** `src/services/dataCleanupService.ts`

**Funcionalidades:**

- ✅ Limpa dados do Firestore (piscinas, obras, manutenções)
- ✅ Limpa dados do Realtime Database
- ✅ Limpa dados do Local Storage
- ✅ Garante sincronização adequada de utilizadores
- ✅ Fornece estatísticas de limpeza detalhadas

**Métodos principais:**

```typescript
// Limpar todos os dados
await dataCleanupService.cleanAllData();

// Inicializar aplicação limpa
await dataCleanupService.initializeCleanApplication();

// Garantir sincronização de utilizadores
await dataCleanupService.ensureUserSynchronization();

// Verificar estado da aplicação
const stats = dataCleanupService.getCleanupStats();
```

### 2. Hook de Limpeza (`useDataCleanup`)

**Localização:** `src/hooks/useDataCleanup.ts`

**Funcionalidades:**

- ✅ Interface React para o serviço de limpeza
- ✅ Estado de loading e erro
- ✅ Estatísticas em tempo real
- ✅ Atualização automática do estado

**Exemplo de uso:**

```typescript
const {
  isLoading,
  cleanupStats,
  error,
  cleanAllData,
  initializeCleanApp,
  ensureUserSync,
} = useDataCleanup();

// Limpar dados
await cleanAllData();
```

### 3. Componente de Gestão (`DataCleanupManager`)

**Localização:** `src/components/DataCleanupManager.tsx`

**Funcionalidades:**

- ✅ Interface visual para limpeza de dados
- ✅ Mostra estado atual da aplicação
- ✅ Botões para diferentes tipos de limpeza
- ✅ Feedback visual detalhado
- ✅ Avisos de segurança

### 4. Inicializador da Aplicação (`AppInitializer`)

**Localização:** `src/components/AppInitializer.tsx`

**Funcionalidades:**

- ✅ Inicialização automática da aplicação
- ✅ Limpeza automática opcional no startup
- ✅ Prompt de escolha quando há dados existentes
- ✅ Garantia de sincronização de utilizadores

### 5. Painel de Gestão Completo (`DataManagementPanel`)

**Localização:** `src/components/DataManagementPanel.tsx`

**Funcionalidades:**

- ✅ Interface completa de gestão
- ✅ Estatísticas da aplicação
- ✅ Gestão de utilizadores
- ✅ Controlo de sincronização
- ✅ Limpeza de dados

## Como Usar

### Opção 1: Limpeza Manual

```typescript
import { useDataCleanup } from '../hooks/useDataCleanup';

function MyComponent() {
  const { cleanAllData, isLoading } = useDataCleanup();

  const handleClean = async () => {
    const result = await cleanAllData();
    if (result.success) {
      console.log('Dados limpos com sucesso!');
    }
  };

  return (
    <button onClick={handleClean} disabled={isLoading}>
      {isLoading ? 'A Limpar...' : 'Limpar Dados'}
    </button>
  );
}
```

### Opção 2: Componente Completo

```typescript
import DataCleanupManager from '../components/DataCleanupManager';

function MyPage() {
  return (
    <div>
      <h1>Gestão de Dados</h1>
      <DataCleanupManager
        onCleanupComplete={() => console.log('Limpeza concluída!')}
      />
    </div>
  );
}
```

### Opção 3: Limpeza Automática no Startup

```typescript
import AppInitializer from '../components/AppInitializer';

function App() {
  return (
    <AppInitializer autoCleanOnStartup={true}>
      {/* Sua aplicação aqui */}
      <MyMainApp />
    </AppInitializer>
  );
}
```

### Opção 4: Painel de Gestão Completo

```typescript
import DataManagementPanel from '../components/DataManagementPanel';

function AdminPage() {
  return <DataManagementPanel />;
}
```

## Integração com a Aplicação Existente

### 1. Modificar o useDataSync (Já Implementado)

O hook `useDataSync` foi modificado para:

- ✅ Detectar quando a aplicação foi limpa
- ✅ Usar apenas dados mock quando limpa recentemente
- ✅ Incluir função `cleanAllData` no retorno

### 2. Integração com Firebase (Já Implementado)

Os serviços Firebase foram melhorados para:

- ✅ Sincronização automática de utilizadores
- ✅ Limpeza coordenada entre Firestore e Realtime Database
- ✅ Logging adequado das operações

### 3. Adicionar à Navegação

Para integrar na aplicação principal, adicione ao menu de navegação:

```typescript
// No seu menu principal
{
  id: 'data-management',
  label: 'Gestão de Dados',
  icon: Database,
  component: DataManagementPanel,
  adminOnly: true // Apenas para super admins
}
```

## Estados da Aplicação

### Estado Limpo

- ✅ Sem dados de piscinas, obras ou manutenções no localStorage
- ✅ Apenas dados mock disponíveis
- ✅ Flag `app-cleaned` presente no localStorage
- ✅ Utilizadores mantidos para sincronização

### Estado com Dados

- ⚠️ Dados existentes no localStorage
- ⚠️ Possível inconsistência entre fontes de dados
- ⚠️ Recomenda-se limpeza

### Estado Indeterminado

- ❓ Sem dados mas sem flag de limpeza
- ❓ Primeira utilização ou erro anterior

## Monitorização e Logs

Todas as operações são registadas no console:

```
✅ Firebase initialized successfully
✅ Data cleanup completed successfully
✅ User João Silva (joao@email.com) added and will be synchronized automatically
⚠️ Firebase not configured - user sync limited to local storage
❌ Firebase sync failed: connection timeout
```

## Segurança e Precauções

### ⚠️ Avisos Importantes

1. **Operação Irreversível**: A limpeza de dados é permanente
2. **Backup Recomendado**: Faça backup antes de limpar dados importantes
3. **Utilizadores Preservados**: Os utilizadores nunca são eliminados
4. **Sincronização Garantida**: Novos utilizadores são sempre sincronizados

### 🔒 Controlos de Segurança

- ✅ Confirmação obrigatória antes da limpeza
- ✅ Logs detalhados de todas as operações
- ✅ Estado da aplicação sempre verificável
- ✅ Fallback para dados mock em caso de erro

## Exemplos de Implementação

### Página Simples de Limpeza

Veja: `src/pages/DataManagementPage.tsx`

```typescript
export function SimpleCleanupPage() {
  return (
    <AppInitializer autoCleanOnStartup={false}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Limpeza de Dados</h1>
          <DataCleanupManager />
        </div>
      </div>
    </AppInitializer>
  );
}
```

### Limpeza Automática

```typescript
export function AutoCleanPage() {
  return (
    <AppInitializer autoCleanOnStartup={true}>
      <MyCleanApp />
    </AppInitializer>
  );
}
```

## Resolução de Problemas

### Problema: Dados não são limpos

**Solução:**

1. Verificar conexão Firebase
2. Verificar permissões de escrita
3. Verificar logs do console
4. Tentar limpeza manual do localStorage

### Problema: Utilizadores não sincronizam

**Solução:**

1. Verificar configuração Firebase
2. Usar `ensureUserSync()`
3. Verificar logs de sincronização
4. Reinicializar serviços Firebase

### Problema: Estado inconsistente

**Solução:**

1. Usar `refreshStats()` para atualizar
2. Fazer limpeza completa com `initializeCleanApp()`
3. Verificar flags no localStorage
4. Reiniciar aplicação

## Conclusão

A funcionalidade de limpeza de dados foi implementada de forma abrangente, garantindo que:

✅ **Todas as obras, manutenções e piscinas são eliminadas**
✅ **Utilizadores ficam sempre sincronizados**
✅ **A aplicação mantém um estado consistente**
✅ **Há feedback adequado para o utilizador**
✅ **As operações são seguras e auditáveis**

Para começar a usar, importe e utilize qualquer um dos componentes ou hooks disponíveis conforme as suas necessidades específicas.
