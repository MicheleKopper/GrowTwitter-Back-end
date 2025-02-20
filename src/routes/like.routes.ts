import { Router } from "express";
import { LikeController } from "../controllers/like.controller";
import { FindAllLikeMidlleware } from "../middlewares/like/find-all-like.middlewares";
import { UpdateLikeMiddleware } from "../middlewares/like/update-like.middlewares";
import { CreateLikeMiddleware } from "../middlewares/like/create-like.middlewaress";
import { ValidateUuidMiddleware } from "../middlewares/validate-uuid.middlewares";
import { AuthMiddleware } from "../middlewares/auth/auth-middlewares";

export class LikeRoutes {
  public static execute(): Router {
    const router = Router();

    // POST - CRIAR UM LIKE
    router.post(
      "/likes",
      [
        AuthMiddleware.validate, // Verifica se o usuário está autenticado
        CreateLikeMiddleware.validateTypes, // Valida os tipos dos dados para o like
      ],
      LikeController.create
    );

    // GET - FILTRAR TODOS OS LIKES DE UM TWEET ESPECÍFICO
    router.get(
      "/likes",
      [
        AuthMiddleware.validate,
        FindAllLikeMidlleware.validateTypes, // Valida os tipos dos parâmetros de consulta
      ],
      LikeController.findAll
    );

    // GET - FILTRAR LIKES DE UM USUÁRIO ESPECÍFICO
    router.get(
      "/likes/:id_usuario",
      [AuthMiddleware.validate, ValidateUuidMiddleware.validate], // Valida o UUID do usuário
      LikeController.findOneById
    );

    // PUT - ATUALIZAR UM LIKE
    router.put(
      "/likes/:id_like",
      [
        AuthMiddleware.validate, // Verifica se o usuário está autenticado
        UpdateLikeMiddleware.validateTypes, // Valida os tipos dos dados para o like
        UpdateLikeMiddleware.validateData, // Valida os dados do like
      ],
      LikeController.update
    );

    // DELETE - REMOVER UM LIKE
    router.delete(
      "/likes/:id_like",
      [
        AuthMiddleware.validate, // Verifica se o usuário está autenticado
      ],
      LikeController.delete
    );

    return router;
  }
}
