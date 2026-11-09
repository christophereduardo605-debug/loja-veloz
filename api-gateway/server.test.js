const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { once } = require("node:events");

test("API Gateway responde corretamente ao /health", async () => {
  const port = 39001;

  const servidor = spawn(process.execPath, ["server.js"], {
    cwd: __dirname,
    env: {
      ...process.env,
      PORT: String(port),
    },
    stdio: "ignore",
  });

  try {
    let resposta;

    for (let tentativa = 0; tentativa < 30; tentativa++) {
      try {
        resposta = await fetch(`http://127.0.0.1:${port}/health`);
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    assert.ok(resposta, "A API não iniciou");

    assert.equal(resposta.status, 200);

    const dados = await resposta.json();

    assert.equal(dados.status, "ok");
    assert.equal(dados.servico, "api-gateway");
  } finally {
    servidor.kill();
    if (servidor.exitCode === null && servidor.signalCode === null) {
      await once(servidor, "exit");
    }
  }
});
