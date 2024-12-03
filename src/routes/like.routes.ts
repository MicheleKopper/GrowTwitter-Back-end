// routes: Define as rotas da API, mapeando URLs específicas para funções nos controladores.

import { Router } from "express";
import { LikeController } from "../controllers/like.controller";
import { FindAllLikeMidlleware } from "../middlewares/like/find-all-like.middlewares";

export class LikeRoutes {
  public static execute(): Router {
    const router = Router();

    // POST - CRIAR UM LIKE
    router.post("/likes", LikeController.create);

    // GET - FILTRAR TODOS OS LIKES DE UM TWEET ESPECÍFICO
    router.get("/likes", [FindAllLikeMidlleware.validateTypes], LikeController.findAll);

    return router;
  }

   
}
