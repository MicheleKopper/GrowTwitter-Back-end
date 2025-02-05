import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";
import { LoginMiddleware } from "../middlewares/auth/login-middlewares";

export class AuthRoutes {
  public static execute(): Router {
    const router = Router();

    router.post("/login", [LoginMiddleware.validateRequired, LoginMiddleware.validateTypes], AuthController.login);
    return router;
  }
}
