import { buildApp } from "./app.js";

const PORT = parseInt(process.env.API_PORT ?? "3001", 10);
const HOST = process.env.API_HOST ?? "0.0.0.0";

async function start() {
  const app = await buildApp();
  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`VidyaSetu API running on http://${HOST}:${PORT}`);
    app.log.info(`Swagger docs: http://${HOST}:${PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  process.exit(0);
});

process.on("SIGTERM", async () => {
  process.exit(0);
});

start();
