import { Router } from "express";
import { CreateReplyMiddleware } from "../middlewares/reply/create-reply-middlewares";
import { ReplyController } from "../controllers/reply.controller";
import { UpdateReplyMiddleware } from "../middlewares/reply/update-reply-middlewares";
import { AuthMiddleware } from "../middlewares/auth/auth-middlewares";
import { FindOneByIdMiddleware } from "../middlewares/reply/find-one-by-id-reply-midllewares";

export class ReplyRoutes {
  public static execute(): Router {
    const router = Router();

    // POST - CRIAR UMA RESPOSTA
    router.post(
      "/replies",
      [
        AuthMiddleware.validate,
        CreateReplyMiddleware.validateRequired,
        CreateReplyMiddleware.validateTypes,
        CreateReplyMiddleware.validateData,
      ],
      ReplyController.create
    );

    // GET - LISTA TODAS AS RESPOSTAS
    router.get("/replies/", [AuthMiddleware.validate], ReplyController.findAll);

    // GET - FILTRAR UMA RESPOSTA ESPECÍFICA POR ID
    router.get(
      "/replies/:id_reply",
      [AuthMiddleware.validate, FindOneByIdMiddleware.validateRequired],
      ReplyController.findOneById
    );

    // PUT - ATUALIZAR/EDITAR UMA RESPOSTA EXISTENTE
    router.put(
      "/replies/:id_reply",
      [AuthMiddleware.validate, UpdateReplyMiddleware.validateTypes],
      ReplyController.update
    );

    // DELETE - REMOVER UMA RESPOSTA
    router.delete(
      "/replies/:id_reply",
      [AuthMiddleware.validate],
      ReplyController.delete
    );
    return router;
  }
}
