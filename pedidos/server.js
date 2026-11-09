const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "loja",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "lojaveloz",
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", servico: "pedidos" });
  } catch (erro) {
    res.status(503).json({
      status: "erro",
      mensagem: "Banco de dados indisponível",
    });
  }
});

app.get("/pedidos", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM pedidos ORDER BY id");
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({
      erro: "Erro ao consultar pedidos",
    });
  }
});

app.post("/pedidos", async (req, res) => {
  const { produto, quantidade } = req.body;

  if (
    typeof produto !== "string" ||
    !produto.trim() ||
    !Number.isInteger(quantidade) ||
    quantidade <= 0
  ) {
    return res.status(400).json({
      erro: "Produto e quantidade válida são obrigatórios",
    });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO pedidos (produto, quantidade, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [produto.trim(), quantidade, "criado"],
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    res.status(500).json({
      erro: "Erro ao criar pedido",
    });
  }
});

async function iniciar() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        produto VARCHAR(100) NOT NULL,
        quantidade INTEGER NOT NULL CHECK (quantidade > 0),
        status VARCHAR(30) NOT NULL DEFAULT 'criado',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const PORT = process.env.PORT || 3001;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Serviço de Pedidos rodando na porta ${PORT}`);
    });
  } catch (erro) {
    console.error("Erro ao conectar ao PostgreSQL:", erro.message);
    process.exit(1);
  }
}

if (require.main === module) {
  iniciar();
}

module.exports = { app };
