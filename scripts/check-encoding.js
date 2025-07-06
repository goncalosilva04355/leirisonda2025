#!/usr/bin/env node

/**
 * Script para verificar e corrigir problemas de encoding nos arquivos
 * Previne que caracteres mal codificados (�) voltem a aparecer
 */

const fs = require("fs");
const path = require("path");

// Caracteres problemáticos para procurar
const PROBLEMATIC_CHARS = [
  "�", // Losango com ponto de interrogação
  "��",
  "���",
  "����",
  "�����",
];

// Padrões comuns de caracteres mal codificados
const ENCODING_FIXES = {
  ã: /\�\�/g,
  ção: /\�\�\�o/g,
  á: /\�/g,
  é: /\�/g,
  í: /\�/g,
  ó: /\�/g,
  ú: /\�/g,
  ç: /\�/g,
  â: /\�/g,
  ê: /\�/g,
  ô: /\�/g,
  à: /\�/g,
  "€": /\�\�\�\�/g,
  "📞": /\�\�\�/g,
  "📍": /\�\�/g,
  "🔍": /\�\�\�/g,
  "←": /\�\�/g,
};

function checkFileEncoding(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const issues = [];

    // Verificar caracteres problemáticos
    PROBLEMATIC_CHARS.forEach((char) => {
      if (content.includes(char)) {
        const lines = content.split("\n");
        lines.forEach((line, index) => {
          if (line.includes(char)) {
            issues.push({
              line: index + 1,
              char: char,
              text: line.trim(),
            });
          }
        });
      }
    });

    return issues;
  } catch (error) {
    console.warn(`Erro ao ler arquivo ${filePath}:`, error.message);
    return [];
  }
}

function scanDirectory(dirPath) {
  const issues = [];

  try {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);

      if (
        stat.isDirectory() &&
        !file.startsWith(".") &&
        file !== "node_modules"
      ) {
        issues.push(...scanDirectory(fullPath));
      } else if (
        file.endsWith(".tsx") ||
        file.endsWith(".ts") ||
        file.endsWith(".js") ||
        file.endsWith(".jsx")
      ) {
        const fileIssues = checkFileEncoding(fullPath);
        if (fileIssues.length > 0) {
          issues.push({
            file: fullPath,
            issues: fileIssues,
          });
        }
      }
    });
  } catch (error) {
    console.warn(`Erro ao escanear diretório ${dirPath}:`, error.message);
  }

  return issues;
}

function main() {
  console.log("🔍 Verificando problemas de encoding...\n");

  const srcIssues = scanDirectory("./src");

  if (srcIssues.length === 0) {
    console.log("✅ Nenhum problema de encoding encontrado!");
  } else {
    console.log("❌ Problemas de encoding encontrados:\n");

    srcIssues.forEach(({ file, issues }) => {
      console.log(`📄 ${file}:`);
      issues.forEach(({ line, char, text }) => {
        console.log(`   Linha ${line}: "${char}" em "${text}"`);
      });
      console.log("");
    });

    console.log(
      "💡 Execute este script em modo de correção: node scripts/check-encoding.js --fix",
    );
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkFileEncoding, scanDirectory, ENCODING_FIXES };
