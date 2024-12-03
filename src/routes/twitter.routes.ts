import { Router } from "express";
import { CreateTwitterMiddleware } from "../middlewares/twitter/create-twitter.middlewares";
import { TwitterController } from "../controllers/twitter.controller";
import { AuthMiddleware } from "../middlewares/auth/auth-middlewares";
import { FindAllTwitterMidlleware } from "../middlewares/twitter/find-all-twitter.middlewares";
import { UpdateTwitterMiddleware } from "../middlewares/twitter/update-twitter.middlewares";
import { ValidateUuidMiddleware } from "../middlewares/validate-uuid.middlewares";

export class TwitterRoutes {
  public static execute(): Router {
    const router = Router();

    // POST - CRIAR UM NOVO TWEET OU REPLY
    router.post(
      "/tweets",
      [
        AuthMiddleware.validate, // Valida se o usuário está autenticado
        CreateTwitterMiddleware.validateRequired, // Valida campos obrigatórios
        CreateTwitterMiddleware.validateTypes, // Valida tipos dos dados
      ],
      TwitterController.create
    );

    // GET - FILTRAR TODOS OS TWEETS
    router.get(
      "/tweets",
      [
        ValidateUuidMiddleware.validate, // Valida o formato do UUID, se necessário
        FindAllTwitterMidlleware.validateTypes, // Valida os tipos dos parâmetros de consulta
      ],
      TwitterController.findAll
    );

    // GET - FILTRAR UM TWEET ESPECÍFICO POR ID
    router.get(
      "/tweets/:id_tweet", // Ajuste o parâmetro para id_tweet, se necessário
      [ValidateUuidMiddleware.validate],
      TwitterController.findOneById
    );

    // PUT - ATUALIZAR/EDITAR UM TWEET EXISTENTE
    router.put(
      "/tweets/:id_tweet", // Ajuste o parâmetro para id_tweet, se necessário
      [
        AuthMiddleware.validate, // Verifica a autenticação antes da edição
        ValidateUuidMiddleware.validate, // Valida o UUID do tweet
        UpdateTwitterMiddleware.validateTypes, // Valida os tipos dos dados para atualização
      ],
      TwitterController.update
    );

    // DELETE - REMOVER UM TWEET
    router.delete(
      "/tweets/:id_tweet", // Ajuste o parâmetro para id_tweet, se necessário
      [
        AuthMiddleware.validate, // Verifica a autenticação antes da exclusão
        ValidateUuidMiddleware.validate, // Valida o UUID do tweet
      ],
      TwitterController.delete
    );

    return router;
  }
}
