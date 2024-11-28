import { Router } from "express";
import { CreateTwitterMiddleware } from "../middlewares/create-twitter.middlewares";
import { TwitterController } from "../controllers/twitter.controller";

export class TwitterRoutes {
  public static execute(): Router {
    const router = Router();

    router.post(
      "/tweets",
      [
        CreateTwitterMiddleware.validateRequired,
        CreateTwitterMiddleware.validateTypes,
      ],
      TwitterController.create
    );
    return router;
  }
}
