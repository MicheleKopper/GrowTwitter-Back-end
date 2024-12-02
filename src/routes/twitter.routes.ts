import { Router } from "express";
import { CreateTwitterMiddleware } from "../middlewares/twitter/create-twitter.middlewares";
import { TwitterController } from "../controllers/twitter.controller";
import { AuthMiddleware } from "../middlewares/auth/auth-middlewares";
import { FindAllTwitterMidlleware } from "../middlewares/twitter/find-all-twitter.middlewares";
import { UpdateTwitterMiddleware } from "../middlewares/twitter/update-twitter.middlewares";

export class TwitterRoutes {
  public static execute(): Router {
    const router = Router();

    // POST - CRIAR UM NOVO TWEET OU REPLY
    router.post(
      "/tweets",
      [
        AuthMiddleware.validate,
        CreateTwitterMiddleware.validateRequired,
        CreateTwitterMiddleware.validateTypes,
      ],
      TwitterController.create
    );

    // GET - FILTRAR TODOS OS TWEETS
    router.get(
      "/tweets",
      [FindAllTwitterMidlleware.validateTypes],
      TwitterController.findAll
    );

    // GET - FILTRAR UM TWEER ESPECÍFICO
    router.get("/tweets/:id_usuario", TwitterController.findOneById);

    // PUT - ATUALIZAR/EDITAR UM TWEET EXISTENTE
    router.put(
      "/tweets/:id_usuario",
      UpdateTwitterMiddleware.validateTypes,
      TwitterController.update
    );

    // DELETE - REMOVER UM TWEET
    router.delete("/tweets/:id_usuario", [], TwitterController.delete);
    return router;
  }
}
