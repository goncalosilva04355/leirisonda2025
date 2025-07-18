# 🚀 Leirisonda PWA Nova

Esta é uma **cópia completa** da aplicação de desenvolvimento da Leirisonda, criada como PWA independente.

## ✨ Características

- 📱 **PWA Completa** - Instalável em mobile e desktop
- 🔔 **Notificações Push** - Sistema completo FCM
- 🌐 **Firestore REST API** - Bypass dos problemas do SDK
- 📄 **PDFs Profissionais** - Geração automática
- ⚡ **Performance Otimizada** - Chunks otimizados
- 🎨 **Interface Idêntica** - Mesma UI da aplicação original

## 🚀 Instalação e Execução

### 1. Instalar Dependências

```bash
cd leirisonda-pwa-nova
npm install
```

### 2. Executar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: http://localhost:5174

### 3. Build para Produção

```bash
npm run build
```

### 4. Preview da Build

```bash
npm run preview
```

## 📁 Estrutura

```
leirisonda-pwa-nova/
├── src/
│   ├── App.tsx                    # App principal (idêntico)
│   ├── components/                # Todos os componentes
│   ├── services/                  # Serviços (incluindo REST API)
│   ├── utils/                     # Utilities (incluindo firestoreRestApi.ts)
│   ├── firebase/                  # Configurações Firebase
│   ├── hooks/                     # Custom hooks
│   ├── pages/                     # Páginas
│   └── config/                    # Configurações
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── icon.svg                   # Ícone Leirisonda
│   └── firebase-messaging-sw.js   # Service Worker FCM
└── package.json                   # Dependências completas
```

## 🔧 Funcionalidades Principais

### Login e Autenticação

- Sistema idêntico ao desenvolvimento
- Utilizador padrão: `gongonsilva@gmail.com` / `19867gsf`

### Gestão de Dados

- **Obras** - CRUD completo
- **Piscinas** - Gestão completa
- **Manutenções** - Registo e acompanhamento
- **Clientes** - Base de dados de clientes
- **Utilizadores** - Gest��o de permissões

### Firebase REST API

- ✅ **Configurado e funcional**
- ✅ **Projeto**: `leiria-1cfc9`
- ✅ **Bypass dos problemas do SDK**

### PWA Features

- 📱 Instalável (Add to Home Screen)
- 🔄 Offline support
- 🔔 Push notifications
- 📊 Performance otimizada

## 🌐 Deploy

### Netlify (Recomendado)

1. Fazer build: `npm run build`
2. Arrastar pasta `dist/` para: https://app.netlify.com/drop

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔧 Configurações Firebase

A aplicação usa **REST API** para comunicar com Firestore:

- **Projeto**: `leiria-1cfc9`
- **API Key**: Configurada em `src/utils/firestoreRestApi.ts`
- **Service Worker**: `public/firebase-messaging-sw.js`

## 📱 PWA Installation

### iPhone/iPad

1. Abrir no Safari
2. Tocar em "Partilhar"
3. "Adicionar ao Ecrã Principal"

### Android

1. Abrir no Chrome
2. Banner "Instalar App" aparece automaticamente
3. Confirmar instalação

## 🚀 Performance

- **Chunks Otimizados**: React, UI, PDF vendors separados
- **Minificação**: esbuild para builds rápidas
- **Tree Shaking**: Dependências não utilizadas removidas
- **Lazy Loading**: Componentes carregados sob demanda

## 🛠️ Tecnologias

- **React 18** + TypeScript
- **Vite** - Build tool rápido
- **Tailwind CSS** - Styling
- **Lucide React** - Ícones
- **Firebase** - Backend
- **jsPDF** - Geração PDFs

## 📄 Scripts Disponíveis

- `npm run dev` - Servidor desenvolvimento
- `npm run build` - Build produção
- `npm run preview` - Preview da build
- `npm run test` - Executar testes

---

**🎉 Aplicação PWA completa e funcional, idêntica à versão de desenvolvimento!**
