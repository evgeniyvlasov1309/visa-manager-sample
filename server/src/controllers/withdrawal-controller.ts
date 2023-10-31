import { NextFunction, Request, Response } from "express";
import { User } from "../models/user-model";
import { WithdrawalService } from "../services/withdrawal-service";

export class WithdrawalController {
  static async getWithdrawals(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;
      const userData = (req as any).user as User;
      const withdrawals = await WithdrawalService.getWithdrawals(
        query,
        userData
      );

      return res.json(withdrawals);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async createWithdrawal(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userData = (req as any).user;
      const ids = req.body;
      const url = await WithdrawalService.createWithdrawal(ids, userData);

      return res.json(url);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async updateWithdrawal(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const withdrawal = req.body;
      const { id } = req.params;
      const userData = (req as any).user;
      const updatedWithdrawal = await WithdrawalService.updateWithdrawal(
        +id,
        withdrawal,
        userData
      );
      return res.json(updatedWithdrawal);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async removeWithdrawal(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const userData = (req as any).user;
      await WithdrawalService.removeWithdrawal(+id, userData);
      return res.json({});
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
}
