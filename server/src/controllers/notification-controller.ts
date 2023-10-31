import { NextFunction, Request, Response } from "express";
import { User } from "../models/user-model";
import { NotificationService } from "../services/notification-service";

export class NotificationController {
  static async getNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query = req.query;
      const userData = (req as any).user as User;

      const data = await NotificationService.getNotifications(query, userData);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async updateNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const data = await NotificationService.markAsRead(+id);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
