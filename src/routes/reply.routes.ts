import { Router } from "express";
import { CreateReplyMiddleware } from "../middlewares/reply/create-reply-middlewares";
import { ReplyController } from "../controllers/reply.controller";


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
    return router;
  }
}
