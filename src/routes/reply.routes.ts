import { Router } from "express";
import { CreateReplyMiddleware } from "../middlewares/reply/create-reply-middlewares";
import { ReplyController } from "../controllers/reply.controller";
import { FindAllReplyMidlleware } from "../middlewares/reply/find-all-reply-midllewares";
import { UpdateReplyMiddleware } from "../middlewares/reply/update-reply-middlewares";

export class ReplyRoutes {
  public static execute(): Router {
    const router = Router();

    // POST - CRIAR UMA RESPOSTA
    router.post(
      "/replies",
      [
        CreateReplyMiddleware.validateRequired,
        CreateReplyMiddleware.validateTypes,
        CreateReplyMiddleware.validateData,
      ],
      ReplyController.create
    );

    // GET - LISTA TODAS AS RESPOSTAS
    router.get(
      "/replies/:id_reply",
      [FindAllReplyMidlleware.validateRequired],
      ReplyController.findAll
    );

    // GET - FILTRAR UMA RESPOSTA ESPECÍFICA POR ID
    router.get("/replies/:id_reply", ReplyController.findOneById);

    // PUT - ATUALIZAR/EDITAR UMA RESPOSTA EXISTENTE
    router.put(
      "/replies/:id_reply",
      [UpdateReplyMiddleware.validateTypes],
      ReplyController.update
    );

    // DELETE - REMOVER UMA RESPOSTA

    return router;
  }
}
