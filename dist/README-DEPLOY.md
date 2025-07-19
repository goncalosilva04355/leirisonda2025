# Deploy Manual - Pasta /dist

Esta pasta contém todos os arquivos necessários para fazer deploy manual da aplicação Leirisonda PWA.

## Como fazer deploy

### Opção 1: Deploy direto por FTP/Upload

1. Faça upload de todo o conteúdo desta pasta `/dist` para o diretório raiz do seu servidor web
2. Certifique-se de que o arquivo `index.html` está na raiz do domínio
3. Configure HTTPS no seu servidor (obrigatório para PWA)

### Opção 2: Netlify (Drag & Drop)

1. Acesse https://netlify.com
2. Faça login na sua conta
3. Arraste toda a pasta `/dist` para a área de drop do Netlify
4. O deploy será feito automaticamente

### Opção 3: Vercel

1. Instale o Vercel CLI: `npm install -g vercel`
2. Na pasta `/dist`, execute: `vercel --prod`
3. Siga as instruções no terminal

### Opção 4: GitHub Pages

1. Crie um novo repositório no GitHub
2. Faça upload dos conteúdos da pasta `/dist`
3. Vá nas configurações do repositório > Pages
4. Selecione "Deploy from a branch" > "main" > "/ (root)"

## Arquivos importantes

- `index.html` - Página principal da aplicação
- `manifest.json` - Configuração da PWA
- `sw.js` - Service Worker para funcionalidade offline
- `firebase-messaging-sw.js` - Service Worker para notificações
- `assets/` - CSS, JavaScript e outros recursos da aplicação
- `_headers` e `_redirects` - Configurações para Netlify

## Verificação do Deploy

Após o deploy, verifique:

1. A aplicação carrega em `https://seudominio.com`
2. PWA funciona (ícone de instalação aparece no browser)
3. Service Worker está ativo (veja no DevTools > Application > Service Workers)
4. Manifesto carrega sem erros (DevTools > Application > Manifest)

## Atualizações

Para atualizar a aplicação:

1. Execute `npm run build` na pasta do projeto
2. Substitua todo o conteúdo do servidor pelos novos arquivos da pasta `/dist`
3. Force refresh (Ctrl+F5) para garantir que o cache seja limpo

---

**Data do Build:** $(date)
**Versão:** 2.0.0
