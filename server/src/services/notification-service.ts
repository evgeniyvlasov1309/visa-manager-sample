import ejs from "ejs";
import path from "path";
import QueryString from "qs";
import { ApiError } from "../exceptions/api-error";
import { notificationModel } from "../models/notification-model";
import { User, userModel } from "../models/user-model";
import { DateFormatter } from "../utils/dateFormatter";
import { EmailService } from "./email-service";
import { TelegramService } from "./telegram-service";

interface NotificationData {
  delivered: boolean;
  title: string;
  description: string;
  message: string;
  recordStatus: string;
  payment: boolean;
  postPayment: boolean;
  paymentCode: number;
  userId: number;
}

export class NotificationService {
  static async getNotifications(query: QueryString.ParsedQs, user: User) {
    const { delivered, limit, offset } = query;

    const notifications = await notificationModel.findAndCountAll({
      where: {
        delivered,
        userId: user.id,
      },
      offset: offset ? parseInt(offset as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });

    return {
      rows: notifications.rows.map((n) => n.toDto()),
      count: notifications.count,
    };
  }

  static async createNotification(notificationData: NotificationData) {
    const notification = await notificationModel.create({
      ...notificationData,
    });

    const user = await userModel.findByPk(notification.userId);

    if (user?.notificationEmailEnabled) {
      const html = await ejs.renderFile(
        path.join(__dirname, "../../", "public", "mails", "notification.ejs"),
        {
          data: {
            title: notification.title,
            description: notification.description,
            message: notification.message,
            createdAt: DateFormatter.formatDate(notification.createdAt),
          },
        }
      );

      await EmailService.sendMessageToUser(
        notificationData.userId,
        html,
        "Новое уведомление"
      );
    }

    if (user?.notificationTelegramEnabled) {
      await TelegramService.sendMessage(
        notificationData.userId,
        `${notification.title}\n${notification.description}\n${notification.message}`
      );
    }
  }

  static async markAsRead(id: number) {
    const targetNotification = await notificationModel.findByPk(id);
    if (!targetNotification) {
      throw ApiError.BadRequest(`Уведомление не найдено`);
    }
    targetNotification?.update({ delivered: true });
  }
}
