// routes: Define as rotas da API, mapeando URLs específicas para funções nos controladores.

import { Router } from "express";
import { CreateUsuarioMiddleware } from "../middlewares/create-usuario.middlewares";
import { UsuarioController } from "../controllers/usuario.controller";
import { FindAllMidlleware } from "../middlewares/find-all-usuario.middlewares";
import { UpdateUsuarioMiddleware } from "../middlewares/update-usuario.middlewares";
import { ValidateUuidMiddleware } from "../middlewares/validate-uuid.middlewares";

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

    // GET - FILTRAR TODOS
    router.get(
      "/usuarios",
      [FindAllMidlleware.validateTypes],
      UsuarioController.findAll
    );

    // GET - FILTRAR UM
    router.get("/usuarios/:id_usuario", UsuarioController.findOneById);

    // PUT - ATUALIZAR
    router.put(
      "/usuarios/:id_usuario",
      [
        UpdateUsuarioMiddleware.validateTypes,
        UpdateUsuarioMiddleware.validateData,
      ],
      UsuarioController.update
    );

    // DELETE - REMOVER
    router.delete(
      "/usuarios/:id_usuario",
      ValidateUuidMiddleware.validate,
      UsuarioController.delete
    );
    return router;
  }
}
