#!/bin/bash
# Correção do App.tsx para resolver erros TypeScript

# Substituir "return;" por "return result;" na função handleLoginWithRememberMe
sed 's/        return;/        return result;/' src/App.tsx > src/App.tsx.tmp && mv src/App.tsx.tmp src/App.tsx

echo "Correção aplicada ao App.tsx"
