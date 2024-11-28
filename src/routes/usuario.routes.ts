// routes: Define as rotas da API, mapeando URLs específicas para funções nos controladores.

import { Router } from "express";
import { CreateUsuarioMiddleware } from "../middlewares/create-usuario.middlewares";
import { UsuarioController } from "../controllers/usuario.controller";
import { FindAllMidlleware } from "../middlewares/find-all-usuario.middlewares";

export class UsuarioRoutes {
  public static execute(): Router {
    const router = Router();

    // POST - CRIAR
    router.post(
      "/usuarios",
      [
        CreateUsuarioMiddleware.validateRequired,
        CreateUsuarioMiddleware.validateTypes,
        CreateUsuarioMiddleware.validateData,
      ],
      UsuarioController.create
    );

    // GET - FIND ALL
    router.get(
      "/usuarios",
      [FindAllMidlleware.validateTypes],
      UsuarioController.findAll
    );

    return router;
  }
}
