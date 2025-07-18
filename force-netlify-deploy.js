#!/usr/bin/env node

// Script para forçar deploy no Netlify
// Cria um timestamp para trigger de deploy

const fs = require("fs");
const path = require("path");

const timestamp = new Date().toISOString();
const deployFile = path.join(__dirname, "public", "deploy-timestamp.txt");

// Criar o arquivo de timestamp
const content = `Deploy timestamp: ${timestamp}\nStatus: Forcing new Netlify deploy\n`;

fs.writeFileSync(deployFile, content);

console.log("✅ Deploy trigger criado:", deployFile);
console.log("📅 Timestamp:", timestamp);
console.log("🚀 Netlify deve fazer deploy automático agora");
