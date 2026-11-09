const test = require("node:test");
const assert = require("node:assert/strict");
const { app } = require("./server");

async function requisitar(dados) {
  const servidor = app.listen(0);

  try {
    const porta = servidor.address().port;

    const resposta = await fetch(`http://127.0.0.1:${porta}/pagamentos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    return {
      status: resposta.status,
      dados: await resposta.json(),
    };
  } finally {
    await new Promise((resolve, reject) => {
      servidor.close((erro) => (erro ? reject(erro) : resolve()));
    });
  }
}

test("Aprova pagamento válido", async () => {
  const resposta = await requisitar({
    pedidoId: 1,
    valor: 150,
  });

  assert.equal(resposta.status, 200);
  assert.equal(resposta.dados.status, "aprovado");
  assert.equal(resposta.dados.valor, 150);
});

test("Rejeita pagamento com valor negativo", async () => {
  const resposta = await requisitar({
    pedidoId: 1,
    valor: -50,
  });

  assert.equal(resposta.status, 400);
  assert.ok(resposta.dados.erro);
});

test("Rejeita pagamento sem pedido", async () => {
  const resposta = await requisitar({
    valor: 100,
  });

  assert.equal(resposta.status, 400);
  assert.ok(resposta.dados.erro);
});
