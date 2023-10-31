import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/api-error";
import { User } from "../models/user-model";
import { UserService } from "../services/user-service";

export class UserController {
  static async activation(req: Request, res: Response, next: NextFunction) {
    try {
      const { activationLink } = req.query;

      await UserService.activation(String(activationLink));

      if (process.env.URL) {
        return res.redirect(process.env.URL + "/auth?activated=true");
      } else {
        throw new Error("Непредвиденная ошибка");
      }
    } catch (error) {
      next(error);
    }
  }

  static async resetPasswordLink(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;

      await UserService.resetPasswordLink(email);

      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, resetPasswordToken } = req.body;

      await UserService.resetPassword(password, resetPasswordToken);

      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password } = req.body;
      const userData = (req as any).user as User;
      await UserService.changePassword(userData.id, password);

      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }
      const { email, password } = req.body;
      const userData = await UserService.registration(email, password);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      await UserService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      const userData = await UserService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;
      const users = await UserService.getUsers(query);
      return res.json(users);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.getUser(id);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.body;
      const { id } = req.params;
      const updatedUser = await UserService.updateUser(+id, user);
      return res.json(updatedUser);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async getBotOwnerStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.body;
      const statistics = await UserService.getBotOwnerStatistics(id);
      return res.json(statistics);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
}
