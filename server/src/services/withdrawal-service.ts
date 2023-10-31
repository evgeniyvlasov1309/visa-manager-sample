import ejs from "ejs";
import path from "path";
import QueryString from "qs";
import { Op } from "sequelize";
import { ApiError } from "../exceptions/api-error";
import { recordModel } from "../models/record-model";
import { User, userModel } from "../models/user-model";
import { Withdrawal, withdrawalModel } from "../models/withdrawal-model";
import { DateFormatter } from "../utils/dateFormatter";
import { EmailService } from "./email-service";
import { PriceService } from "./price-service";

export class WithdrawalService {
  static async getWithdrawals(query: QueryString.ParsedQs, user?: User) {
    let { sort = "createdAt_ASC", status, userId, offset, limit } = query;

    const conditions: any = {};

    if (status) {
      conditions.status = status;
    }

    if (user?.isAdmin) {
      if (userId) {
        conditions.userId = userId;
      }
    } else {
      conditions.userId = user?.id;
    }

    const [sortName, sortMethod] = (sort as string).split("_");

    const withdrawals = await withdrawalModel.findAndCountAll({
      where: conditions,
      offset: offset ? parseInt(offset as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      order: [[sortName, sortMethod]],
    });

    const result = {
      count: withdrawals.count,
      rows: withdrawals.rows.map((item) => item.toDto()),
    };

    return result;
  }

  static async createWithdrawal(ids: number[], user: User) {
    const conditions: any = {
      status: "success",
    };

    if (ids.length) {
      conditions.id = {
        [Op.in]: ids,
      };
    }

    const withdrawalRecords = await recordModel.findAll({
      where: conditions,
    });

    const recordPrices = await Promise.all(
      withdrawalRecords.map((r) => {
        return PriceService.getRecordPrice(r.id);
      })
    );

    const amount = recordPrices.reduce(
      (acc, curr) => acc + curr * (user.commissionPercentage / 100),
      0
    );

    const withdrawal = await withdrawalModel.create({
      amount,
      records: withdrawalRecords.map((item) => item.id),
      userId: user?.id,
      userEmail: user?.email,
    });

    await Promise.all(
      withdrawalRecords.map((record) => {
        record.update({
          paidToBotOwnerStatus: "pending",
          withdrawalId: withdrawal.id,
        });
      })
    );

    const html = await ejs.renderFile(
      path.join(__dirname, "../../", "public", "mails", "new-withdrawal.ejs"),
      {
        data: {
          id: withdrawal.id,
          email: user?.email,
          amount: withdrawal.amount,
          status: "Ожидает",
          createdAt: DateFormatter.formatDate(withdrawal.createdAt),
        },
      }
    );

    EmailService.sendMessageToAdmins(html, "Новый запрос на вывод средств");
  }

  static async updateWithdrawal(
    id: number,
    withdrawalData: Withdrawal,
    user?: User
  ) {
    const withdrawal = await withdrawalModel.findByPk(id);

    if (!withdrawal) {
      throw ApiError.BadRequest(`Запись не найдена`);
    }

    const botOwner = await userModel.findByPk(withdrawal.userId);

    if (!botOwner) return;

    const oldWithdrawalRecords = await recordModel.findAll({
      where: {
        id: {
          [Op.in]: withdrawal.records.filter(
            (id) => !withdrawalData.records.includes(id)
          ),
        },
      },
    });

    const newWithdrawalRecords = await recordModel.findAll({
      where: {
        id: {
          [Op.in]: withdrawalData.records.map((item) => +item),
        },
      },
    });

    const recordPrices = await Promise.all(
      newWithdrawalRecords.map((r) => {
        return PriceService.getRecordPrice(r.id);
      })
    );

    const amount = recordPrices.reduce(
      (acc, curr) => acc + curr * (botOwner.commissionPercentage / 100),
      0
    );

    await withdrawal.update({ ...withdrawalData, amount });

    // Возвращаем всем записям заявки статус Не оплачен
    await Promise.all(
      oldWithdrawalRecords.map((record) => {
        record.update({
          paidToBotOwnerStatus: "not-paid",
        });
      })
    );

    // Ставим всем записям заявки (обновленным) статус в соответствии со статусом заявки
    await Promise.all(
      newWithdrawalRecords.map((record) => {
        record.update({
          paidToBotOwnerStatus: withdrawalData.status,
        });
      })
    );

    let withdrawalStatusLabel =
      withdrawalData.status === "pending"
        ? "Ожидает"
        : withdrawalData.status === "approved"
        ? "Одобрена"
        : "Отклонена";

    const html = await ejs.renderFile(
      path.join(__dirname, "../../", "public", "mails", "new-withdrawal.ejs"),
      {
        data: {
          id: withdrawal.id,
          email: user?.email,
          amount: withdrawal.amount,
          status: withdrawalStatusLabel,
          createdAt: DateFormatter.formatDate(withdrawal.createdAt),
          comment: withdrawal.adminComment,
        },
      }
    );

    if (withdrawalData.status === "pending") {
      EmailService.sendMessageToAdmins(
        html,
        "Заявка на вывод средств обновлена"
      );
    } else if (withdrawalData.status === "approved") {
      EmailService.sendMessageToUser(
        withdrawal.userId,
        html,
        "Заявка на вывод средств одобрена"
      );
    } else {
      EmailService.sendMessageToUser(
        withdrawal.userId,
        html,
        "Заявка на вывод средств отклонена"
      );
    }
  }

  static async removeWithdrawal(id: number, userData: User) {
    const withdrawal = await withdrawalModel.findOne({
      where: { id, userId: userData.id },
    });

    if (!withdrawal) {
      throw ApiError.BadRequest(`Запись не найдена`);
    }

    const conditions: any = {};

    if (withdrawal.records.length) {
      conditions.id = {
        [Op.in]: withdrawal.records,
      };
    }

    const unpaidRecords = await recordModel.findAll({
      where: conditions,
    });

    await Promise.all(
      unpaidRecords.map((record) => {
        record.update({
          paidToBotOwnerStatus: "not-paid",
        });
      })
    );

    await withdrawal.destroy();
  }
}
