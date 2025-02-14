import { NextFunction, Request, Response } from "express";

export class ValidateUuidMiddleware {
  static validate(req: Request, res: Response, next: NextFunction) {
    const { id_usuario } = req.params;

    if (!id_usuario) {
      res.status(400).json({
        ok: false,
        message: "Identificador obrigatório!",
      });
      return;
    }

    // Validar o formato desse id
    // Regex busca por padrões
    const regexUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!regexUuid.test(id_usuario)) {
      res.status(400).json({
        ok: false,
        message: "Identificador precisa ser um Uuid!",
      });
      return;
    }
    next();
  }
}
