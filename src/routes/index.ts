import { Express } from "express";
import { AuthRoutes } from "./auth.routes";
import { UsuarioRoutes } from "./usuario.routes";
import { TwitterRoutes } from "./twitter.routes";
import { ReplyRoutes } from "./reply.routes";
import { LikeRoutes } from "./like.routes";
import { FollowRoutes } from "./follow.routes";

export const makeRoutes = (app: Express) => {
    // Chamada das rotas
    // ROTA PADRÃO
    app.get("/", (req, res) => {
      res.status(200).json({
        ok: true,
        message: "Api GrowTwitter 💛",
      });
    });
    
    // ROTA AUTH ROUTES
    app.use(AuthRoutes.execute());
    
    // ROTA USUÁRIO
    app.use(UsuarioRoutes.execute());
    
    // ROTA TWITTER
    app.use(TwitterRoutes.execute());
    
    // ROTA REPLY
    app.use(ReplyRoutes.execute());
    
    // ROTA LIKE
    app.use(LikeRoutes.execute());
    
    // ROTA FOLLOW
    app.use(FollowRoutes.execute());
};
