import { Router } from "express";
import { CreateUsuarioMiddleware } from "../middlewares/usuario/create-usuario.middlewares";
import { UsuarioController } from "../controllers/usuario.controller";
import { FindAllMidlleware } from "../middlewares/usuario/find-all-usuario.middlewares";
import { UpdateUsuarioMiddleware } from "../middlewares/usuario/update-usuario.middlewares";
import { ValidateUuidMiddleware } from "../middlewares/validate-uuid.middlewares";
import { AuthMiddleware } from "../middlewares/auth/auth-middlewares";

export class UsuarioRoutes {
  public static execute(): Router {
    const router = Router();

    // POST - CRIAR UM NOVO USUÁRIO
    router.post(
      "/usuarios",
      [
        CreateUsuarioMiddleware.validateRequired,
        CreateUsuarioMiddleware.validateTypes,
        CreateUsuarioMiddleware.validateData,
      ],
      UsuarioController.create
    );

    // GET - FILTRAR TODOS OS USUÁRIOS (só para admin ou usuário com permissão)
    router.get(
      "/usuarios",
      [AuthMiddleware.validate, FindAllMidlleware.validateTypes],
      UsuarioController.findAll
    );

    // GET - FILTRAR UM USUÁRIO ESPECÍFICO
    router.get(
      "/usuarios/:id_usuario",
      [AuthMiddleware.validate], // Protege a rota para garantir que o usuário esteja autenticado
      UsuarioController.findOneById
    );

    // PUT - ATUALIZAR UM USUÁRIO
    router.put(
      "/usuarios/:id_usuario",
      [
        AuthMiddleware.validate, // Verifica se o usuário está autenticado
        ValidateUuidMiddleware.validate, // Valida o formato do UUID
        UpdateUsuarioMiddleware.validateTypes,
        UpdateUsuarioMiddleware.validateData,
      ],
      UsuarioController.update
    );

    // DELETE - REMOVER UM USUÁRIO
    router.delete(
      "/usuarios/:id_usuario",
      [
        AuthMiddleware.validate, // Verifica se o usuário está autenticado
        ValidateUuidMiddleware.validate, // Valida o formato do UUID
      ],
      UsuarioController.delete
    );

    return router;
  }
}
