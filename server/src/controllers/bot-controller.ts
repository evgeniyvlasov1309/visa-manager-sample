import { NextFunction, Request, Response } from "express";
import { BotService } from "../services/bot-service";

export class BotController {
  static async createBot(req: Request, res: Response, next: NextFunction) {
    try {
      const { country, userId } = req.body;
      const botData = await BotService.createBot(country, userId);
      return res.json(botData);
    } catch (error) {
      next(error);
    }
  }

  static async getBots(req: Request, res: Response, next: NextFunction) {
    try {
      const botData = await BotService.getBots();
      return res.json(botData);
    } catch (error) {
      next(error);
    }
  }
}
