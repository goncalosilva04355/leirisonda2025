# 🔄 Guia de Sincronização Firebase - Leirisonda

## ✨ O que foi implementado

A aplicação Leirisonda agora suporta **sincronização em tempo real** entre múltiplos dispositivos usando Firebase Firestore. Isso significa que:

- ✅ **Dados sincronizados**: Todas as alterações aparecem instantaneamente em todos os dispositivos
- ✅ **Múltiplos utilizadores**: Vários utilizadores podem trabalhar simultaneamente
- ✅ **Backup automático**: Dados seguros na nuvem Google
- ✅ **Modo offline**: Funciona sem internet, sincroniza quando reconecta

## 🚀 Como Ativar a Sincronização

### 1. Configurar Firebase

1. **Acesse o console Firebase**: [console.firebase.google.com](https://console.firebase.google.com)
2. **Crie um novo projeto** ou selecione o existente "leirisonda"
3. **Ative Firestore Database**:
   - Vá para "Firestore Database"
   - Clique "Create database"
   - Escolha "Start in test mode" (por agora)

### 2. Obter Credenciais

1. **Configurações do projeto**:

   - No console Firebase, clique no ⚙️ ao lado de "Project Overview"
   - Selecione "Project settings"

2. **Configurar Web App**:
   - Vá para a aba "General"
   - Na seção "Your apps", clique no ícone "</>"
   - Registe a app com nome "Leirisonda"
   - **Copie as credenciais que aparecem**

### 3. Configurar na Aplicação

1. **Abra a aplicação Leirisonda**
2. **Vá para Configurações** (ícone ⚙️ na barra lateral)
3. **Clique "Configurar Firebase"**
4. **Cole as credenciais** obtidas no passo anterior
5. **Clique "Guardar Configuração"**

## 📱 Como Funciona

### Estados de Sincronização

- 🟢 **Conectado**: Ícone WiFi verde com ponto pulsante
- 🔴 **Desconectado**: Ícone WiFi cortado cinzento

### Dados Sincronizados

- **👥 Utilizadores**: Gestão de utilizadores e permissões
- **🏊 Piscinas**: Todas as piscinas e seus dados
- **🔧 Manutenções**: Histórico e futuras manutenções
- **🏗️ Obras**: Projetos e trabalhos realizados

### Funcionalidades Temps Real

1. **Adicionar dados**: Aparecem imediatamente noutros dispositivos
2. **Editar registos**: Alterações sincronizam automaticamente
3. **Eliminar items**: Remoções aplicam-se a todos os dispositivos
4. **Notificações visuais**: Indicadores mostram estado da conexão

## 🔧 Resolução de Problemas

### Problema: "Erro ao sincronizar dados"

- ✅ Verifique conexão à internet
- ✅ Confirme credenciais Firebase
- ✅ Clique "Reconectar" nas configurações

### Problema: Dados não aparecem

- ✅ Aguarde alguns segundos (pode haver latência)
- ✅ Recarregue a página
- ✅ Verifique se todos os dispositivos usam as mesmas credenciais

### Problema: Permissões negadas

- ✅ Configure regras Firestore (ver secção abaixo)

## 🔐 Configurar Segurança Firestore

No console Firebase, vá para "Firestore Database" → "Rules" e substitua por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita autenticada
    match /{document=**} {
      allow read, write: if true; // TEMPORÁRIO - configurar autenticação depois
    }
  }
}
```

⚠️ **Importante**: Estas regras são para teste. Configure autenticação adequada para produção.

## 🌟 Vantagens da Sincronização

### Para Equipas

- **Colaboração real**: Múltiplos técnicos podem trabalhar simultaneamente
- **Atualizações instantâneas**: Sem necessidade de "refresh"
- **Dados consistentes**: Todos veem a mesma informação

### Para Gestão

- **Visibilidade total**: Acompanhe trabalho em tempo real
- **Relatórios atualizados**: Dados sempre atuais
- **Backup automático**: Nunca perca informação

### Para Clientes

- **Transparência**: Acompanhe progresso das obras
- **Relatórios atuais**: Informação sempre atualizada
- **Histórico completo**: Acesso a todo o histórico

## 📞 Suporte

Se tiver problemas:

1. **Configurações**: Verifique estado na secção "Configurações"
2. **Reconectar**: Use botão "Reconectar" se necessário
3. **Logs**: Abra Console do Browser (F12) para ver erros
4. **Contacto**: gongonsilva@gmail.com para suporte técnico

---

**🎉 Parabéns!** A sua aplicação Leirisonda agora sincroniza em tempo real entre todos os dispositivos da equipa!
