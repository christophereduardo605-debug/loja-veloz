const test = require("node:test");
const assert = require("node:assert/strict");
const { app } = require("./server");

test("Rejeita pedido sem produto", async () => {
  const servidor = app.listen(0);

  try {
    const porta = servidor.address().port;

    const resposta = await fetch(`http://127.0.0.1:${porta}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        produto: "",
        quantidade: 2,
      }),
    });

    assert.equal(resposta.status, 400);

    const dados = await resposta.json();
    assert.ok(dados.erro);
  } finally {
    await new Promise((resolve, reject) => {
      servidor.close((erro) => (erro ? reject(erro) : resolve()));
    });
  }
});

test("Rejeita pedido com quantidade negativa", async () => {
  const servidor = app.listen(0);

  try {
    const porta = servidor.address().port;

    const resposta = await fetch(`http://127.0.0.1:${porta}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        produto: "Notebook",
        quantidade: -1,
      }),
    });

    assert.equal(resposta.status, 400);
  } finally {
    await new Promise((resolve, reject) => {
      servidor.close((erro) => (erro ? reject(erro) : resolve()));
    });
  }
});
