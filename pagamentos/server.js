const express = require("express");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    servico: "pagamentos",
  });
});

app.post("/pagamentos", (req, res) => {
  const { pedidoId, valor } = req.body;

  if (
    pedidoId === undefined ||
    pedidoId === null ||
    typeof valor !== "number" ||
    !Number.isFinite(valor) ||
    valor <= 0
  ) {
    return res.status(400).json({
      erro: "Pedido e valor válido são obrigatórios",
    });
  }

  res.status(200).json({
    pedidoId,
    valor,
    status: "aprovado",
    mensagem: "Pagamento simulado com sucesso",
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3002;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serviço de Pagamentos rodando na porta ${PORT}`);
  });
}

module.exports = { app };
