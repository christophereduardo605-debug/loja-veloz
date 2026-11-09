const { NodeSDK } = require("@opentelemetry/sdk-node");

const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");

const { resourceFromAttributes } = require("@opentelemetry/resources");

const { ATTR_SERVICE_NAME } = require("@opentelemetry/semantic-conventions");

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "api-gateway",
  }),

  traceExporter: new OTLPTraceExporter({
    url:
      process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
      "http://localhost:4318/v1/traces",
  }),

  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

process.on("SIGTERM", () => {
  sdk.shutdown().catch(console.error);
});
