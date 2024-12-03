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
    router.get(
      "/likes",
      [FindAllLikeMidlleware.validateTypes],
      LikeController.findAll
    );

    // GET - FILTRAR LIKES DE UM USUÁRIO ESPECÍFICO
    router.get("/likes/:id_usuario", LikeController.findOneById);

    // PUT - ATUALIZAR UM LIKE
    router.put("/likes/id_like", LikeController.update);

    // DELETE - REMOVER
    router.delete("/likes/:id_like", LikeController.delete);

    return router;
  }
}
