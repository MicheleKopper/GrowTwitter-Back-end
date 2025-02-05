import cors from "cors";
import express from "express";
import { makeRoutes } from "./routes";

export const createServer = () => {
  // Config do express
  const app = express();
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  // Chamar as rotas
  makeRoutes(app);

  // Retorno do express
  return app;
};
