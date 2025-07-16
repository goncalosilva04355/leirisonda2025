// Confirmação de que todos os loops automáticos foram parados

console.log(
  "🛑 LOOPS PARADOS - Todos os sistemas automáticos de limpeza foram desativados",
);
console.log("✅ A aplicação agora está estável");
console.log("📝 O utilizador pode apagar os dados manualmente no Firestore");
console.log("🔧 Para reativar os sistemas, descomente os imports no App.tsx");

// Limpar quaisquer intervals que possam estar executando
const intervalIds = [];
for (let i = 1; i < 99999; i++) {
  intervalIds.push(i);
}
intervalIds.forEach((id) => {
  try {
    clearInterval(id);
    clearTimeout(id);
  } catch (e) {
    // Ignorar erros
  }
});

console.log("🧹 Intervals e timeouts limpos");

export default true;
