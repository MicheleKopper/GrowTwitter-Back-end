import { Router } from "express";
import { CreateReplyMiddleware } from "../middlewares/reply/create-reply-middlewares";
import { ReplyController } from "../controllers/reply.controller";
import { FindAllReplyMidlleware } from "../middlewares/reply/find-all-reply-midllewares";

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
      "/replies/:idTweet",
      [FindAllReplyMidlleware.validateRequired],
      ReplyController.findAll
    );
    return router;
  }
}
