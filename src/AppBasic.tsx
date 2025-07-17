import React from "react";

const AppBasic: React.FC = () => {
  return (
    <div>
      <header>
        <h1>Leirisonda</h1>
        <p>Sistema de Gestão de Piscinas</p>
      </header>

      <main>
        <section>
          <h2>Bem-vindo</h2>
          <p>Sistema de gestão para piscinas e obras.</p>
        </section>

        <section>
          <h3>Serviços</h3>
          <ul>
            <li>Gestão de Obras</li>
            <li>Manutenção de Piscinas</li>
            <li>Relatórios</li>
          </ul>
        </section>
      </main>

      <footer>
        <p>© 2025 Leirisonda</p>
      </footer>
    </div>
  );
};

export default AppBasic;
