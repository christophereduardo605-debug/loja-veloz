const test = require("node:test");
const assert = require("node:assert/strict");
const { app } = require("./server");

async function requisitar(rota, metodo = "GET", dados) {
  const servidor = app.listen(0);

  try {
    const porta = servidor.address().port;

    const resposta = await fetch(`http://127.0.0.1:${porta}${rota}`, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      ...(dados !== undefined && {
        body: JSON.stringify(dados),
      }),
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

test("Consulta os produtos do estoque", async () => {
  const resposta = await requisitar("/estoque");

  assert.equal(resposta.status, 200);
  assert.ok(Array.isArray(resposta.dados));
  assert.equal(resposta.dados.length, 3);
});

test("Reserva um produto disponível", async () => {
  const resposta = await requisitar("/estoque/reservar", "POST", {
    produtoId: 1,
    quantidade: 2,
  });

  assert.equal(resposta.status, 200);
  assert.equal(resposta.dados.produto.quantidade, 8);
});

test("Rejeita quantidade negativa", async () => {
  const resposta = await requisitar("/estoque/reservar", "POST", {
    produtoId: 1,
    quantidade: -1,
  });

  assert.equal(resposta.status, 400);
  assert.ok(resposta.dados.erro);
});

test("Rejeita produto inexistente", async () => {
  const resposta = await requisitar("/estoque/reservar", "POST", {
    produtoId: 999,
    quantidade: 1,
  });

  assert.equal(resposta.status, 404);
});

test("Rejeita reserva maior que o estoque", async () => {
  const resposta = await requisitar("/estoque/reservar", "POST", {
    produtoId: 1,
    quantidade: 999,
  });

  assert.equal(resposta.status, 400);
});
