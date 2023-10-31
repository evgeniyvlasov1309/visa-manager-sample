import { NextFunction, Request, Response } from "express";
import { Bot } from "../models/bot-model";
import { User } from "../models/user-model";
import { RecordService } from "../services/record-service";

export class RecordController {
  static async createRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const record = req.body;
      const userData = (req as any).user;
      const recordData = await RecordService.createRecord(userData, record);
      return res.json(recordData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updateRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const record = req.body;
      const { id } = req.params;
      const userData = (req as any).user;
      const botData = (req as any).bot;
      let updatedRecord;
      if (userData) {
        updatedRecord = await RecordService.updateRecordByUser(
          +id,
          record,
          userData
        );
      } else {
        updatedRecord = await RecordService.updateRecordByBot(
          +id,
          record,
          botData
        );
      }
      return res.json(updatedRecord);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async removeRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userData = (req as any).user;
      await RecordService.removeRecordByUser(userData, +id);
      return res.json({});
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async getRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;
      const userData = (req as any).user as User;
      const botData = (req as any).bot as Bot;
      let records;

      if (userData?.type === "botOwner") {
        records = await RecordService.getBotOwnerRecords(query, userData);
      } else {
        records = await RecordService.getRecords(query, userData, botData);
      }

      return res.json(records);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async getRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userData = (req as any).user;
      const botData = (req as any).bot;
      const record = await RecordService.getRecord(
        parseInt(id),
        userData,
        botData
      );
      return res.json(record);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
}
