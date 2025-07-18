# Área de Administração - Leirisonda

Esta pasta contém todos os componentes de teste, debug e configuração do sistema, protegidos por autenticação.

## Componentes Disponíveis

### AdminLogin.tsx

- Componente de autenticação para acesso à área restrita
- Password padrão: `admin123` (deve ser alterada em produção)

### AdminPage.tsx

- Página principal da área de administração
- Centraliza acesso a todas as ferramentas de teste e debug

## Ferramentas Disponíveis

1. **Diagnóstico de Autenticação** - Teste e debug do sistema de autenticação
2. **Gestor de Sincronização** - Sincronização completa de dados Firebase
3. **Estado do Firebase** - Monitorização da ligação Firebase
4. **Debug de Utilizadores** - Debug e teste de utilizadores
5. **Limpeza de Dados** - Limpeza e manutenção da base de dados
6. **Gestão de Dados** - Painel de gestão de dados do sistema
7. **Configuração Firebase** - Configurações do Firebase

## Acesso

- Apenas utilizadores com role `super_admin` têm acesso ao botão de administração
- O acesso é feito através do menu lateral → "Administração"
- Requer autenticação adicional com password de administração

## Segurança

- Todos os componentes de teste foram removidos da interface principal
- Acesso protegido por múltiplas camadas de autenticação
- Password de administração deve ser alterada em ambiente de produção

## Notas

- Em produção, considere usar variáveis de ambiente para a password
- Os componentes debug não aparecem mais na interface normal
- Área completamente isolada do resto da aplicação
