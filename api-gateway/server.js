const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    servico: "api-gateway",
  });
});

const servicos = [
  {
    rota: "/pedidos",
    destino: process.env.PEDIDOS_URL || "http://localhost:3001",
  },
  {
    rota: "/pagamentos",
    destino: process.env.PAGAMENTOS_URL || "http://localhost:3002",
  },
  {
    rota: "/estoque",
    destino: process.env.ESTOQUE_URL || "http://localhost:3003",
  },
];

servicos.forEach(({ rota, destino }) => {
  app.use(
    rota,
    createProxyMiddleware({
      target: destino,
      changeOrigin: true,
      pathRewrite: (path) => rota + path,
      on: {
        error: (err, req, res) => {
          if (!res.headersSent) {
            res.writeHead(502, {
              "Content-Type": "application/json",
            });
          }
          res.end(
            JSON.stringify({
              erro: "Serviço indisponível",
            }),
          );
        },
      },
    }),
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
