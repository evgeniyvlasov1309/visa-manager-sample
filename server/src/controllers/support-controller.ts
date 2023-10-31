import { NextFunction, Request, Response } from "express";
import { SupportService } from "../services/support-service";

export class SupportController {
  static async createSupportTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = req.body;
      await SupportService.createSupportTicket(data);
      return res.status(200).json();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
