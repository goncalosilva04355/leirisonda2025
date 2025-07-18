#!/bin/bash

echo "🚀 Building Leirisonda PWA Nova..."
echo "📦 Installing dependencies..."
npm ci

echo "🔧 Building application..."
npm run build

echo "✅ Build completed!"
echo "📁 Output directory: dist/"
echo "🌐 Ready for Netlify deployment!"

# Verificar se build foi bem sucedida
if [ -d "dist" ]; then
    echo "✅ Build folder created successfully"
    echo "📄 Files in dist:"
    ls -la dist/
else
    echo "❌ Build failed - no dist folder found"
    exit 1
fi
