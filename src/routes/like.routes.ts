// routes: Define as rotas da API, mapeando URLs específicas para funções nos controladores.

import { Router } from "express";
import { LikeController } from "../controllers/like.controller";

export class LikeRoutes {
  public static execute(): Router {
    const router = Router();

    // POST - CRIAR
    router.post("/likes", LikeController.create);

    // GET - FILTRAR TODOS
    router.get("/likes", [], LikeController.findAll);



    
    return router;
  }

   
}
