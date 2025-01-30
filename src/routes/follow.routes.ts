import { Router } from "express";
import { CreateFollowMiddleware } from "../middlewares/follow/create-follow-middlewares";
import { FollowController } from "../controllers/follow.controller";

export class FollowRoutes {
  public static execute(): Router {
    const router = Router();

    // POST - SEGUIR UM USUÁRIO
    router.post(
      "/follow",
      [CreateFollowMiddleware.validateRequired],
      FollowController.create
    );

    // GET - LISTA SEGUIDORES DE UM USUÁRIO (meus seguidores)
    router.get(
      "/follow",
      [CreateFollowMiddleware.validateRequired],
      FollowController.findAllFollowers
    );

    // follower = seguidor
    // following = seguindo

    return router;
  }
}
