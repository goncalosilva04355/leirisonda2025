#!/bin/bash

echo "🔧 Configurando variáveis do Firebase no Netlify..."

# Configure as variáveis Firebase no Netlify
netlify env:set VITE_FIREBASE_API_KEY "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw"
netlify env:set VITE_FIREBASE_AUTH_DOMAIN "leiria-1cfc9.firebaseapp.com"
netlify env:set VITE_FIREBASE_PROJECT_ID "leiria-1cfc9"
netlify env:set VITE_FIREBASE_STORAGE_BUCKET "leiria-1cfc9.firebasestorage.app"
netlify env:set VITE_FIREBASE_MESSAGING_SENDER_ID "632599887141"
netlify env:set VITE_FIREBASE_APP_ID "1:632599887141:web:1290b471d41fc3ad64eecc"
netlify env:set VITE_FIREBASE_MEASUREMENT_ID "G-Q2QWQVH60L"
netlify env:set VITE_FIREBASE_DATABASE_URL "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app"

echo "✅ Variáveis configuradas!"
echo "🚀 Fazendo deploy..."

netlify deploy --prod

echo "🎉 Deploy completo!"
