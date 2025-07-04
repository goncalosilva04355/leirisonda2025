// Utility to fix Alexandre's password
export const fixAlexandrePassword = () => {
  const mockUsers = localStorage.getItem("mock-users");

  if (mockUsers) {
    try {
      const users = JSON.parse(mockUsers);
      const alexandreIndex = users.findIndex(
        (user: any) =>
          user.name.toLowerCase().includes("alexandre") ||
          user.email.toLowerCase().includes("alexandre"),
      );

      if (alexandreIndex !== -1) {
        users[alexandreIndex].password = "69alexandre";
        localStorage.setItem("mock-users", JSON.stringify(users));
        console.log("✅ Password do Alexandre corrigida para: 69alexandre");
        return true;
      } else {
        console.log("❌ Utilizador Alexandre não encontrado");
        return false;
      }
    } catch (error) {
      console.error("Erro ao corrigir password do Alexandre:", error);
      return false;
    }
  }

  return false;
};
