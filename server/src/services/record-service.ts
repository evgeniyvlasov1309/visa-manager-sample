import { addDays } from "date-fns";
import cron from "node-cron";
import QueryString from "qs";
import { Op } from "sequelize";
import { ApiError } from "../exceptions/api-error";
import { Applicant, applicantModel } from "../models/applicant-model";
import { Bot, botModel } from "../models/bot-model";
import { Record, RecordRaw, recordModel } from "../models/record-model";
import { User, userModel } from "../models/user-model";
import { addRecordPermissionsCheck } from "../utils/addRecordPermissionsCheck";
import { findObjectChanges } from "../utils/findObjectChanges";
import { PriceService } from "./price-service";
import {
  NotificationMessages,
  RecordNotificationService,
} from "./record-notification-service";

export class RecordService {
  static async createRecord(userData: User, recordData: RecordRaw) {
    const record = await recordModel.create({
      ...recordData,
      userId: userData.id,
      agent: userData.email,
    });

    const applicants = await Promise.all(
      recordData.applicants.map((applicant) =>
        applicantModel.create({ ...applicant, recordId: record.id })
      )
    );

    const recordDto = record.toDto();

    return { ...recordDto, applicants };
  }

  static async updateRecordByUser(
    id: number,
    recordData: RecordRaw,
    user: User
  ) {
    const payloadWithPermissions = await addRecordPermissionsCheck(user, {
      id,
    });

    const record = await recordModel.findOne({
      where: payloadWithPermissions,
    });

    if (!record) {
      throw ApiError.BadRequest(`Запись не найдена`);
    }

    const oldValues = record.toDto(true, false);

    const recordChanges = findObjectChanges(oldValues, recordData);

    console.log("recordChanges", recordChanges);

    if (record.status === "error" && recordData.status === "error") {
      recordData.status = "pending";
    }

    if (recordData.payment === true) {
      recordData.deleteDate = null;
    }

    const result = await record.update({ ...recordData, errorMessage: null });

    if (recordData.applicants && user) {
      await applicantModel.destroy({ where: { recordId: id } });
      await Promise.all(
        recordData.applicants.map((applicant) =>
          applicantModel.create({ ...applicant, error: null, recordId: id })
        )
      );
    }

    return result.toDto(user?.isAdmin, false);
  }

  static async updateRecordByBot(id: number, recordData: RecordRaw, bot: Bot) {
    const record = await recordModel.findOne({
      where: { id, destinationCountry: bot?.country },
    });

    if (!record) {
      throw ApiError.BadRequest(`Запись не найдена`);
    }

    if (record.status === "success") {
      throw ApiError.BadRequest(`Запись уже записана`);
    }

    const botOwner = await userModel.findByPk(bot.userId);

    if (!botOwner) {
      throw ApiError.BadRequest(`Разработчик не найден`);
    }

    let confirmationFile: Buffer | null = null;

    if (recordData.status === "success" && record.postPayment) {
      recordData.postPayment = false;
    }

    if (recordData.confirmationFile) {
      confirmationFile = Buffer.from(recordData.confirmationFile, "base64");
    }

    const result = await record.update({
      status: recordData.status,
      recordingDate: recordData.recordingDate,
      confirmationFile,
      postPayment: recordData.postPayment,
      errorMessage: recordData.errorMessage,
      botId: bot.id,
      botOwner: botOwner?.email,
    });

    RecordService.processRecordAfterUpdate(result);

    return result.toDto(false, true);
  }

  static async removeRecord(record: Record) {
    await applicantModel.destroy({ where: { recordId: record.id } });
    await record.destroy();
  }

  static async removeRecordByUser(userData: User, id: number) {
    const payloadWithPermissions = await addRecordPermissionsCheck(userData, {
      id,
    });

    const record = await recordModel.findOne({
      where: payloadWithPermissions,
    });

    if (!record) {
      throw ApiError.BadRequest(`Запись не найдена`);
    }

    RecordService.removeRecord(record);
  }

  static async getBotOwnerRecords(query: QueryString.ParsedQs, user: User) {
    let {
      sort = "createdAt_ASC",
      search,
      offset,
      limit,
      ...queryParams
    } = query;

    const [sortName, sortMethod] = (sort as string).split("_");

    const bots = await botModel.findAll({ where: { userId: user.id } });

    const whereConditions: any = {
      where: {
        status: "success",
        botId: { [Op.or]: [bots.map((b) => b.id)] },
        ...queryParams,
      },
    };

    if (search && whereConditions.where) {
      whereConditions.where = {
        ...whereConditions.where,
        [Op.or]: [
          {
            id: {
              [Op.eq]: parseInt(search as string) || 0,
            },
          },
          {
            paymentCode: {
              [Op.eq]: parseInt(search as string) || 0,
            },
          },
          {
            firstName: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            surname: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            "$applicants.firstName$": { [Op.like]: `%${search}%` },
          },
          {
            "$applicants.surname$": { [Op.like]: `%${search}%` },
          },
          {
            "$applicants.passportNumber$": { [Op.like]: `%${search}%` },
          },
          {
            "$applicants.applicationNumber$": { [Op.like]: `%${search}%` },
          },
        ],
      };
    }

    const response = (await recordModel.findAndCountAll({
      include: [
        {
          model: Applicant,
          as: "applicants",
          required: true,
          duplicating: false,
          where: {},
        },
      ],
      where: {
        status: "success",
        botId: { [Op.or]: [bots.map((b) => b.id)] },
        ...queryParams,
      },
      offset: offset ? parseInt(offset as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      order: [[sortName, sortMethod]],
    })) as {
      rows: (Record & { applicants: Applicant[] })[];
      count: number;
    };

    const recordsRows = await Promise.all(
      response.rows.map(async (record) => {
        let result = {
          ...record.toDto(false, false),
          applicants: record.applicants.map((applicant) => applicant.toDto()),
          price:
            (await PriceService.getRecordPrice(record.id)) *
            (user.commissionPercentage / 100),
        };

        return result;
      })
    );

    const result = {
      count: response.count,
      rows: recordsRows,
    };

    return result;
  }

  static async getRecords(query: QueryString.ParsedQs, user?: User, bot?: Bot) {
    let {
      sort = "createdAt_ASC",
      search,
      offset,
      limit,
      type,
      ...queryParams
    } = query;

    const [sortName, sortMethod] = (sort as string).split("_");

    let payloadWithPermissions;

    if (user) {
      if (queryParams.status === "active") {
        queryParams.status = {
          [Op.or]: ["progress", "pending", "error"],
        } as any;
      }
      payloadWithPermissions = await addRecordPermissionsCheck(
        user,
        queryParams
      );
    }

    const whereConditions = {
      where: user
        ? payloadWithPermissions
        : {
            destinationCountry: bot?.country,
            botId: { [Op.or]: [bot?.id, null] },
            status: queryParams.status || { [Op.or]: ["progress", "pending"] },
            [Op.or]: [{ payment: true }, { postPayment: true }],
          },
    };

    if (type && whereConditions.where) {
      whereConditions.where.type = type;
    }

    if (search && whereConditions.where) {
      whereConditions.where = {
        ...whereConditions.where,
        [Op.or]: [
          {
            id: {
              [Op.eq]: parseInt(search as string) || 0,
            },
          },
          {
            paymentCode: {
              [Op.eq]: parseInt(search as string) || 0,
            },
          },
          {
            firstName: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            surname: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            "$applicants.firstName$": { [Op.like]: `%${search}%` },
          },
          {
            "$applicants.surname$": { [Op.like]: `%${search}%` },
          },
          {
            "$applicants.passportNumber$": { [Op.like]: `%${search}%` },
          },
          {
            "$applicants.applicationNumber$": { [Op.like]: `%${search}%` },
          },
        ],
      };
    }

    const response = (await recordModel.findAndCountAll({
      include: [
        {
          model: Applicant,
          as: "applicants",
          required: true,
          duplicating: false,
          where: {},
        },
      ],
      ...whereConditions,
      offset: offset ? parseInt(offset as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      order: [[sortName, sortMethod]],
    })) as {
      rows: (Record & { applicants: Applicant[] })[];
      count: number;
    };

    const isBot = !!bot;

    if (isBot) {
      await Promise.all(
        response.rows.map((item) => {
          if (item.status === "pending") {
            item.lastRequestedAt = new Date().toISOString();
            return item.save();
          }
        })
      );
    }

    const recordsRows = await Promise.all(
      response.rows.map(async (record) => {
        let result = {
          ...record.toDto(user?.isAdmin, !!bot),
          applicants: record.applicants.map((applicant) =>
            applicant.toDto(isBot, record.destinationCountry)
          ),
        };
        const recordOwner = await userModel.findByPk(record.userId);
        if (
          isBot &&
          recordOwner?.secretFields &&
          !record.ignoreSecretFields &&
          record.destinationCountry === "Ch"
        ) {
          for (const key in recordOwner.secretFields as any) {
            if (
              recordOwner.secretFields.hasOwnProperty(key) &&
              (recordOwner.secretFields as any)[key]
            ) {
              (result as any)[key] = (recordOwner.secretFields as any)[key];
            }
          }
        }
        if (!isBot) {
          result = Object.assign(result, {
            editable: true,
            removable: true,
            price: await PriceService.getRecordPrice(record.id),
          });
        }
        return result;
      })
    );

    const result = {
      count: response.count,
      rows: recordsRows,
    };

    return result;
  }

  static async getRecord(id: number, user?: User, bot?: Bot) {
    let payloadWithPermissions;
    if (user) {
      payloadWithPermissions = await addRecordPermissionsCheck(user, {
        id,
      });
    }

    const whereConditions = {
      where: user
        ? payloadWithPermissions
        : {
            destinationCountry: bot?.country,
            id,
          },
    };

    const record = await recordModel.findOne({
      ...whereConditions,
    });

    if (!record) {
      throw ApiError.BadRequest(`Запись не найдена`);
    }

    const applicants = await applicantModel.findAll({
      where: { recordId: record.id },
    });

    if (!!bot) {
      record.lastRequestedAt = new Date().toISOString();
      record.status = "progress";
      await record.save();
    }

    return {
      ...record.toDto(user?.isAdmin, !!bot),
      applicants,
    };
  }

  static async processRecordAfterUpdate(record: Record) {
    const recordData = record.toDto(true, false);

    const thirtyDaysLater = addDays(new Date(), 30);

    let message = "";

    if (recordData?.status === "success" && !record.payment) {
      await record.update({ deleteDate: thirtyDaysLater });
      message = NotificationMessages.RECORD_SUCCESS_POSTPAYMENT_30;
    } else if (recordData?.status === "success" && record.payment) {
      await record.update({ deleteDate: null });
      message = NotificationMessages.RECORD_SUCCESS;
    } else if (recordData?.status === "error") {
      await record.update({ deleteDate: thirtyDaysLater });
      message = NotificationMessages.RECORD_ERROR_30;
    } else {
      await record.update({ deleteDate: null });
    }

    if (!message) return;

    await RecordNotificationService.createNotification(record, message);
  }

  static async processRecordNotifications() {
    cron.schedule("12 0 * * *", async () => {
      const fifteenDaysLater = addDays(new Date(), 15);
      const tenDaysLater = addDays(new Date(), 10);
      //Удаление записей у которых настала дата удаления
      const recordsForDelete = await recordModel.findAll({
        where: {
          payment: false,
          deleteDate: {
            [Op.lt]: new Date(),
          },
        },
      });

      for (const record of recordsForDelete) {
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_REMOVED
        );
        await RecordService.removeRecord(record);
      }

      // Уведомления для записей, требующих оплату
      const recordsForPayment = await recordModel.findAll({
        where: {
          status: "pending",
          postPayment: false,
          payment: false,
          deleteDate: null,
        },
      });

      for (const record of recordsForPayment) {
        await record.update({
          deleteDate: fifteenDaysLater,
        });
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_NO_PAYMENT_15
        );
      }

      const recordsForPayment10DaysLeft = await recordModel.findAll({
        where: {
          status: "pending",
          postPayment: false,
          payment: false,
          deleteDate: {
            [Op.and]: [
              {
                [Op.gte]: addDays(new Date(), 10),
              },
              {
                [Op.lte]: addDays(new Date(), 11),
              },
            ],
          },
        },
      });

      for (const record of recordsForPayment10DaysLeft) {
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_NO_PAYMENT_10
        );
      }

      const recordsForPayment5DaysLeft = await recordModel.findAll({
        where: {
          status: "pending",
          postPayment: false,
          payment: false,
          deleteDate: {
            [Op.and]: [
              {
                [Op.gte]: addDays(new Date(), 5),
              },
              {
                [Op.lte]: addDays(new Date(), 6),
              },
            ],
          },
        },
      });

      for (const record of recordsForPayment5DaysLeft) {
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_NO_PAYMENT_5
        );
      }

      const recordsForPayment1DayLeft = await recordModel.findAll({
        where: {
          status: "pending",
          postPayment: false,
          payment: false,
          deleteDate: {
            [Op.and]: [
              {
                [Op.gte]: addDays(new Date(), 1),
              },
              {
                [Op.lte]: addDays(new Date(), 2),
              },
            ],
          },
        },
      });

      for (const record of recordsForPayment1DayLeft) {
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_NO_PAYMENT_1
        );
      }

      // Уведомления для записей, требующих оплату после записи
      const recordsForPaymentAfterRecording27DaysLeft =
        await recordModel.findAll({
          where: {
            status: "success",
            payment: false,
            deleteDate: {
              [Op.and]: [
                {
                  [Op.gte]: addDays(new Date(), 27),
                },
                {
                  [Op.lte]: addDays(new Date(), 28),
                },
              ],
            },
          },
        });

      for (const record of recordsForPaymentAfterRecording27DaysLeft) {
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_SUCCESS_POSTPAYMENT_27
        );
      }

      const recordsForPaymentAfterRecording24DaysLeft =
        await recordModel.findAll({
          where: {
            status: "success",
            payment: false,
            deleteDate: {
              [Op.and]: [
                {
                  [Op.gte]: addDays(new Date(), 24),
                },
                {
                  [Op.lte]: addDays(new Date(), 25),
                },
              ],
            },
          },
        });

      for (const record of recordsForPaymentAfterRecording24DaysLeft) {
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_SUCCESS_POSTPAYMENT_24
        );
      }

      const recordsForPaymentAfterRecording20DaysLeft =
        await recordModel.findAll({
          where: {
            status: "success",
            payment: false,
            deleteDate: {
              [Op.and]: [
                {
                  [Op.gte]: addDays(new Date(), 20),
                },
                {
                  [Op.lte]: addDays(new Date(), 21),
                },
              ],
            },
          },
        });

      for (const record of recordsForPaymentAfterRecording20DaysLeft) {
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_SUCCESS_POSTPAYMENT_20
        );
      }

      const recordsForPaymentAfterRecording15DaysLeft =
        await recordModel.findAll({
          where: {
            status: "success",
            payment: false,
            deleteDate: {
              [Op.and]: [
                {
                  [Op.gte]: addDays(new Date(), 15),
                },
                {
                  [Op.lte]: addDays(new Date(), 16),
                },
              ],
            },
          },
        });

      for (const record of recordsForPaymentAfterRecording15DaysLeft) {
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_SUCCESS_POSTPAYMENT_15
        );
      }

      const recordsForPaymentAfterRecording10DaysLeft =
        await recordModel.findAll({
          where: {
            status: "success",
            payment: false,
            deleteDate: {
              [Op.and]: [
                {
                  [Op.gte]: addDays(new Date(), 10),
                },
                {
                  [Op.lte]: addDays(new Date(), 11),
                },
              ],
            },
          },
        });

      for (const record of recordsForPaymentAfterRecording10DaysLeft) {
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_SUCCESS_POSTPAYMENT_10
        );
      }

      const recordsForPaymentAfterRecording1DaysLeft =
        await recordModel.findAll({
          where: {
            status: "success",
            payment: false,
            deleteDate: {
              [Op.and]: [
                {
                  [Op.gte]: addDays(new Date(), 1),
                },
                {
                  [Op.lte]: addDays(new Date(), 2),
                },
              ],
            },
          },
        });

      for (const record of recordsForPaymentAfterRecording1DaysLeft) {
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_SUCCESS_POSTPAYMENT_1
        );
      }

      // Уведомления для записей в статусе ошибка
      const recordsWithError15DaysLeft = await recordModel.findAll({
        where: {
          status: "error",
          payment: "false",
          deleteDate: {
            [Op.and]: [
              {
                [Op.gte]: addDays(new Date(), 15),
              },
              {
                [Op.lte]: addDays(new Date(), 16),
              },
            ],
          },
        },
      });

      for (const record of recordsWithError15DaysLeft) {
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_ERROR_15
        );
      }

      const recordsWithError1DaysLeft = await recordModel.findAll({
        where: {
          status: "error",
          deleteDate: {
            [Op.and]: [
              {
                [Op.gte]: addDays(new Date(), 1),
              },
              {
                [Op.lte]: addDays(new Date(), 2),
              },
            ],
          },
        },
      });

      for (const record of recordsWithError1DaysLeft) {
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_ERROR_1
        );
      }

      // Уведомления с истекшей датой записи
      const recordsWithExpiredDate10DaysLeft = await recordModel.findAll({
        where: {
          status: "pending",
          recordingDateTo: {
            [Op.lt]: new Date(),
          },
          deleteDate: null,
        },
      });

      for (const record of recordsWithExpiredDate10DaysLeft) {
        await record.update({
          deleteDate: tenDaysLater,
        });
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_DATE_EXPIRED_10
        );
      }

      const recordsWithExpiredDate1DaysLeft = await recordModel.findAll({
        where: {
          status: "pending",
          recordingDateTo: {
            [Op.lt]: new Date(),
            [Op.or]: {
              [Op.ne]: null,
            },
          },
          deleteDate: {
            [Op.and]: [
              {
                [Op.gte]: addDays(new Date(), 1),
              },
              {
                [Op.lte]: addDays(new Date(), 2),
              },
            ],
          },
        },
      });

      for (const record of recordsWithExpiredDate1DaysLeft) {
        await RecordNotificationService.createNotification(
          record,
          NotificationMessages.RECORD_DATE_EXPIRED_1
        );
      }
    });
  }
}
