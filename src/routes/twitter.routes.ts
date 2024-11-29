import { Router } from "express";
import { CreateTwitterMiddleware } from "../middlewares/twitter/create-twitter.middlewares";
import { TwitterController } from "../controllers/twitter.controller";
import { AuthMiddleware } from "../middlewares/auth/auth-middlewares";

export class TwitterRoutes {
  public static execute(): Router {
    const router = Router();

    router.post(
      "/tweets",
      [
        AuthMiddleware.validate,
        CreateTwitterMiddleware.validateRequired,
        CreateTwitterMiddleware.validateTypes,
      ],
      TwitterController.create
    );
    return router;
  }
}
