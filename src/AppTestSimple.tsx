function AppTestSimple() {
  console.log("🧪 AppTestSimple renderizando...");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0891b2",
        color: "white",
        padding: "20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Leirisonda - Teste</h1>
      <p>Se vês esta mensagem, a app está a funcionar!</p>
      <div>Data: {new Date().toLocaleString()}</div>
    </div>
  );
}

export default AppTestSimple;
