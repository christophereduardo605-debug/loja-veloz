const express = require("express");

const app = express();
app.use(express.json());

const produtos = [
  { id: 1, nome: "Notebook", quantidade: 10 },
  { id: 2, nome: "Mouse", quantidade: 30 },
  { id: 3, nome: "Teclado", quantidade: 20 },
];

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    servico: "estoque",
  });
});

app.get("/estoque", (req, res) => {
  res.json(produtos);
});

app.post("/estoque/reservar", (req, res) => {
  const { produtoId, quantidade } = req.body;

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    return res.status(400).json({
      erro: "Quantidade inválida",
    });
  }

  const produto = produtos.find((p) => p.id === Number(produtoId));

  if (!produto) {
    return res.status(404).json({
      erro: "Produto não encontrado",
    });
  }

  if (produto.quantidade < quantidade) {
    return res.status(400).json({
      erro: "Estoque insuficiente",
    });
  }

  produto.quantidade -= quantidade;

  res.json({
    mensagem: "Estoque reservado com sucesso",
    produto,
  });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serviço de Estoque rodando na porta ${PORT}`);
});
