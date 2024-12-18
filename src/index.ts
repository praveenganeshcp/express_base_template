import "reflect-metadata";
import express from "express";
const app = express();
import { router } from "./routes";
import { router as apiBuilderRouter } from "./api-builder-routes";
import { router as apiBuilderBuiltinRouter } from "./api-builder-builtin-routes";
import { CONFIG } from "@commons/config";
import { setupContainer } from "@container/setup";
import { adapterRouter } from "./adapter-routes";

const PORT = CONFIG.PORT;

app.use(express.json());

app.use(adapterRouter);

app.use((req, res, next) => {
  console.log(`New request: ${req.method} ${req.url}`);
  next();
})

app.use(router);

app.use(apiBuilderRouter);

app.use(apiBuilderBuiltinRouter);

async function startServer() {
  setupContainer().then(() => {
    console.log("starting server...");
    app.listen(PORT, () => {
      console.log("server started successfully");
    });
  });
}

startServer();
