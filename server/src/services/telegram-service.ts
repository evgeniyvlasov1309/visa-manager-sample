import TelegramBot from "node-telegram-bot-api";
import { userModel } from "../models/user-model";

export class TelegramService {
  static bot: TelegramBot;

  constructor() {
    TelegramService.bot = new TelegramBot(TOKEN, { polling: true });

    TelegramService.bot.on("message", async (msg) => {
      const chatId = msg.chat.id;

      const user = await userModel.findOne({
        where: { notificationTelegram: msg.chat.username },
      });

      if (!user) {
        console.log("Пользователь не найден");
        return;
      }

      user.telegramChatId = chatId;

      await user.save();
    });
  }

  static async sendMessage(userId: number, message: string) {
    try {
      const user = await userModel.findByPk(userId);

      if (!user) {
        console.log("Пользователь не найден");
        return;
      }

      TelegramService.bot.sendMessage(user.telegramChatId, message);
    } catch (error) {
      console.log(error);
    }
  }
}
