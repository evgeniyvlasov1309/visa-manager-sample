import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/api-error";
import { userModel } from "../models/user-model";
import { TokenService } from "../services/token-service";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.headers.authorization;

    if ((req as any).bot) {
      next();
      return;
    }

    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(" ")[1];

    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = TokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    const fullUserData = await userModel.findByPk(
      (userData as { id: number }).id
    );
    (req as any).user = fullUserData?.toDto();

    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
}
