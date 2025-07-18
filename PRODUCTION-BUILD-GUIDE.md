# Guia: Build de Produção para Builder.io

## Problema Identificado

O index.html estava a referenciar diretamente `/src/main.tsx`, que só funciona em ambiente de desenvolvimento. Para produção, é necessário um build compilado com referências aos ficheiros JavaScript finais.

## Solução Implementada

### 1. Script de Build de Produção

Criado o script `npm run build:production` que:

- Executa o build de produção do Vite
- Verifica se o index.html foi corretamente compilado
- Confirma que não há referências a `/src/main.tsx`
- Lista todos os assets gerados

### 2. Como Executar

```bash
# Executar o build de produção
npm run build:production
```

### 3. Ficheiros Gerados

Após executar o build, os seguintes ficheiros são criados na pasta `dist/`:

#### Index.html de Produção

```html
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Leirisonda - Sistema de Gestão de Piscinas</title>
    <script type="module" crossorigin src="/assets/index-[hash].js"></script>
    <link rel="modulepreload" crossorigin href="/assets/vendor-[hash].js" />
    <link
      rel="modulepreload"
      crossorigin
      href="/assets/react-vendor-[hash].js"
    />
    <link rel="modulepreload" crossorigin href="/assets/pdf-vendor-[hash].js" />
    <link rel="modulepreload" crossorigin href="/assets/ui-vendor-[hash].js" />
    <link rel="stylesheet" crossorigin href="/assets/index-[hash].css" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

#### Assets JavaScript/CSS

- `assets/index-[hash].js` - Código principal da aplicação
- `assets/vendor-[hash].js` - Bibliotecas de terceiros
- `assets/react-vendor-[hash].js` - React e React DOM
- `assets/pdf-vendor-[hash].js` - Bibliotecas de PDF (jsPDF, html2canvas)
- `assets/ui-vendor-[hash].js` - Componentes UI (Lucide, Framer Motion)
- `assets/index-[hash].css` - Estilos compilados

## Para Uso no Builder.io

### 1. Ficheiros para Exportação

- **Principal**: `dist/index.html`
- **Assets**: Toda a pasta `dist/assets/`

### 2. Configuração do Servidor

Certifique-se que o servidor:

- Serve ficheiros estáticos da pasta `assets/`
- Suporta módulos ES6 (type="module")
- Tem CORS configurado corretamente

### 3. Verificações

✅ Index.html não referencia `/src/main.tsx`  
✅ Todos os assets têm hashes únicos  
✅ CSS está corretamente linkado  
✅ JavaScript é carregado como módulo

## Comando Rápido

```bash
# Build completo para produção
npm run build:production

# Os ficheiros prontos estão em: dist/
```

## Notas Importantes

- O hash nos nomes dos ficheiros muda a cada build
- Sempre use `dist/index.html` para produção
- Nunca use o `index.html` da raiz em produção
- Todos os assets devem ser servidos com os caminhos corretos

## Troubleshooting

### Se o build falhar:

```bash
# Limpar cache e tentar novamente
rm -rf node_modules dist
npm install
npm run build:production
```

### Se ainda referenciar /src/main.tsx:

Verificar se está a usar o ficheiro correto: `dist/index.html` e não `./index.html`
