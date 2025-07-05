import React, { useState } from "react";

function App() {
  const [works, setWorks] = useState<any[]>([]);
  const [currentUser] = useState({
    name: "Gonçalo Fonseca",
    email: "gongonsilva@gmail.com",
  });

  const createWork = () => {
    const newWork = {
      id: Date.now(),
      title: `Nova Obra ${Date.now()}`,
      client: "Cliente Teste",
      status: "pending",
      createdAt: new Date().toLocaleString(),
    };

    setWorks((prev) => [...prev, newWork]);
    alert("Obra criada com sucesso!");
  };

  const viewWorkDetails = (work: any) => {
    alert(`Detalhes da Obra:
    
Nome do Cliente: ${work.client}
Título: ${work.title}
Status: ${work.status}
Criada em: ${work.createdAt}`);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Leirisonda - Sistema de Gestão</h1>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginBottom: "20px",
        }}
      >
        <h2>Bem-vindo, {currentUser.name}</h2>
        <p>Sistema funcionando correctamente!</p>

        <button
          onClick={createWork}
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Criar Nova Obra
        </button>
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        <h3>Obras Criadas ({works.length})</h3>

        {works.length === 0 ? (
          <p>
            Nenhuma obra criada ainda. Clique no botão acima para criar uma.
          </p>
        ) : (
          <div>
            {works.map((work) => (
              <div
                key={work.id}
                style={{
                  border: "1px solid #eee",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                  background: "#f9f9f9",
                  cursor: "pointer",
                }}
                onClick={() => viewWorkDetails(work)}
              >
                <h4 style={{ margin: "0 0 5px 0" }}>{work.title}</h4>
                <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                  Cliente: {work.client} | Status: {work.status}
                </p>
                <p style={{ margin: "0", fontSize: "12px", color: "#999" }}>
                  Criada em: {work.createdAt}
                </p>
                <p
                  style={{
                    margin: "5px 0 0 0",
                    fontSize: "12px",
                    color: "#3b82f6",
                  }}
                >
                  Clique para ver detalhes
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>✅ Sistema básico funcionando</p>
        <p>✅ Criação de obras operacional</p>
        <p>✅ Click para ver detalhes implementado</p>
        <p>✅ Nome do cliente aparece nos detalhes</p>
        <p>✅ Dados preservados durante a sessão</p>
      </div>
    </div>
  );
}

export default App;
