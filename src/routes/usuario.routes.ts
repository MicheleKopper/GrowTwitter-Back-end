// routes: Define as rotas da API, mapeando URLs específicas para funções nos controladores.

import { Router } from "express";
import { CreateUsuarioMiddleware } from "../middlewares/create-usuario.middlewares";
import { UsuarioController } from "../controllers/usuario.controller";

export class UsuarioRoutes {
  public static execute(): Router {
    const router = Router();

    router.post(
      "/usuarios",
      [
        CreateUsuarioMiddleware.validateRequired,
        CreateUsuarioMiddleware.validateTypes,
        CreateUsuarioMiddleware.validateData,
      ],
      UsuarioController.create
    );

    return router;
  }
}
