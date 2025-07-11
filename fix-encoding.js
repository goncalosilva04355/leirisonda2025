const fs = require("fs");
const path = require("path");

// Mapeamento de caracteres corrompidos para caracteres corretos
const fixes = {
  "���": "⚠️",
  "��": "✅",
  "����": "🔔",
  "����": "👤",
  "����": "📋",
  "��️": "⚠️",
  "���": "🗺️",
  "��": "ã",
  "���": "ção",
  "����": "ação",
  "�����": "ução",
  "��o": "ção",
  "���o": "ção",
  "����o": "ação",
  "�����o": "ução",
  "aplica��ão": "aplicação",
  "Aplica��ão": "Aplicação",
  "gest��o": "gestão",
  "Gest��o": "Gestão",
  "manuten��ão": "manutenção",
  "Manuten��ão": "Manutenção",
  "manuten��ões": "manutenções",
  "Manuten��ões": "Manutenções",
  "informa��ão": "informação",
  "Informa��ão": "Informação",
  "informa��ões": "informações",
  "Informa��ões": "Informações",
  "configura��ão": "configuração",
  "Configura��ão": "Configuração",
  "configura��ões": "configurações",
  "Configura��ões": "Configurações",
  "observa��ão": "observação",
  "Observa��ão": "Observação",
  "observa��ões": "observações",
  "Observa��ões": "Observações",
  "localiza��ão": "localização",
  "Localiza��ão": "Localização",
  "atribu��da": "atribuída",
  "Atribu��da": "Atribuída",
  "or��amento": "orçamento",
  "Or��amento": "Orçamento",
  "notifica��ão": "notificação",
  "Notifica��ão": "Notificação",
  "notifica��ões": "notificações",
  "Notifica��ões": "Notificações",
  "sincroniza��ão": "sincronização",
  "Sincroniza��ão": "Sincronização",
  "descri��ão": "descrição",
  "Descri��ão": "Descrição",
  "opera��ão": "operação",
  "Opera��ão": "Operação",
  "opera��ões": "operações",
  "Opera��ões": "Operações",
  "t��cnico": "técnico",
  "T��cnico": "Técnico",
  "t��cnicos": "técnicos",
  "T��cnicos": "Técnicos",
  "respons��vel": "responsável",
  "Respons��vel": "Responsável",
  "respons��veis": "responsáveis",
  "Respons��veis": "Responsáveis",
  "dispon��vel": "disponível",
  "Dispon��vel": "Disponível",
  "usu��rio": "usuário",
  "Usu��rio": "Usuário",
  "t��tulo": "título",
  "T��tulo": "Título",
  "relat��rio": "relatório",
  "Relat��rio": "Relatório",
  "monof��sico": "monofásico",
  "conclus��o": "conclusão",
  "Conclus��o": "Conclusão",
  "navega��ão": "navegação",
  "Navega��ão": "Navegação",
  "defini��ões": "definições",
  "Defini��ões": "Definições",
  "ATEN��O": "ATENÇÃO",
  "aten��o": "atenção",
  "Aten��o": "Atenção",
  "telefoneou��o": "telefone",
  "��": "📞",
  "��": "📍",
  "���": "🔍",
  "��": "←",
  "����": "€",
  "n��o": "não",
  "N��o": "Não",
  "est��o": "estão",
  "Est��o": "Estão",
};

function fixEncoding(content) {
  let fixed = content;

  // Aplicar todas as correções
  for (const [corrupted, correct] of Object.entries(fixes)) {
    const regex = new RegExp(
      corrupted.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "g",
    );
    fixed = fixed.replace(regex, correct);
  }

  return fixed;
}

// Corrigir App.tsx
const appPath = path.join(__dirname, "src", "App.tsx");
if (fs.existsSync(appPath)) {
  console.log("Corrigindo encoding em App.tsx...");
  const content = fs.readFileSync(appPath, "utf8");
  const fixed = fixEncoding(content);
  fs.writeFileSync(appPath, fixed, "utf8");
  console.log("✅ App.tsx corrigido!");
} else {
  console.log("❌ App.tsx não encontrado");
}

console.log("🎉 Correção de encoding concluída!");
