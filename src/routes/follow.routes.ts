import { Router } from "express";
import { CreateFollowMiddleware } from "../middlewares/follow/create-follow-middlewares";
import { FollowController } from "../controllers/follow.controller";
import { ValidateUuidMiddleware } from "../middlewares/validate-uuid.middlewares";
import { AuthMiddleware } from "../middlewares/auth/auth-middlewares";

// follower = seguidor
// following = seguindo
// unfollow = deixar de seguir

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
    router.get("/follow/:id_usuario", FollowController.findAllFollowers);

    // DELETE - DEIXAR DE SEGUIR UM USUÁRIO
    router.delete(
      "/follow/:id_follow",
      [AuthMiddleware.validate],
      FollowController.delete
    );

    return router;
  }
}
