const fs = require("fs");
const path = require("path");

// Chaves a serem substituídas
const SECRETS_TO_REPLACE = {
  AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw: "placeholder-api-key",
  AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE: "placeholder-api-key",
  AIzaSyBdV_hGP4_xzY5kqJLm9NzF3rQ8wXeUvAw: "placeholder-api-key",
};

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    Object.keys(SECRETS_TO_REPLACE).forEach((secret) => {
      if (content.includes(secret)) {
        content = content.replace(
          new RegExp(secret, "g"),
          SECRETS_TO_REPLACE[secret],
        );
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Cleaned: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (
      file.endsWith(".ts") ||
      file.endsWith(".tsx") ||
      file.endsWith(".js")
    ) {
      replaceInFile(filePath);
    }
  });
}

console.log("🧹 Removing exposed secrets from codebase...");
walkDirectory("./src");
walkDirectory("./public");
console.log("✅ Secret cleanup completed!");
