import { NextFunction, Request, Response } from "express";
import { ApplicantService } from "../services/applicant-service";

export class ApplicantController {
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const applicant = req.body;
      const { id } = req.params;

      await ApplicantService.update(+id, applicant);

      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
