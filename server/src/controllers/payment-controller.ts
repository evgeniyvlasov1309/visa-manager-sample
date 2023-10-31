import { NextFunction, Request, Response } from "express";
import { PaymentService } from "../services/payment-service";

export class PaymentController {
  static async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = (req as any).user;
      const data = req.body;
      const url = await PaymentService.createPayment(data, userData);

      return res.json(url);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async checkPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { InvId = "", OutSum = "", SignatureValue = "" } = req.query;
      await PaymentService.checkPayment(
        +InvId,
        OutSum as any,
        SignatureValue as any
      );

      res.redirect("/");
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
}
