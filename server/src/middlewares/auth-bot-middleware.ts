import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/api-error";
import { BotService } from "../services/bot-service";

export async function authBotMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const apiKey = req.headers.apikey as string;

    if (apiKey) {
      const botData = await BotService.validateApiKey(apiKey);

      if (!botData) {
        return next(ApiError.UnauthorizedError());
      }
      (req as any).bot = botData;
      next();
      return;
    }

    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
}
