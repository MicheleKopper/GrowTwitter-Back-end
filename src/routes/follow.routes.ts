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
    return router;
  }
}
