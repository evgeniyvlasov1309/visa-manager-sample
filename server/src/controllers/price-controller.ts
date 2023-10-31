import { NextFunction, Request, Response } from "express";
import { PriceService } from "../services/price-service";

export class PriceController {
  static async getPrices(req: Request, res: Response, next: NextFunction) {
    try {
      const prices = await PriceService.getPrices();
      return res.json(prices);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async updatePrices(req: Request, res: Response, next: NextFunction) {
    try {
      const pricesData = req.body;
      const prices = await PriceService.updatePrices(pricesData);
      return res.json(prices);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
}
