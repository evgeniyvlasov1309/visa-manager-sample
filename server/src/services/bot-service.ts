import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../exceptions/api-error";
import { botModel } from "../models/bot-model";

export class BotService {
  static async getBots() {
    const bots = await botModel.findAll();
    return bots.map((bot) => bot.toDto());
  }

  static async createBot(country: string, userId: number) {
    const bot = await botModel.create({
      userId,
      country,
    });

    const apiKey = uuidv4();
    bot.apiKey = apiKey;
    await bot.save();

    const botDto = bot.toDto();

    return {
      ...botDto,
    };
  }

  static async validateApiKey(apiKey: string) {
    const botData = await botModel.findOne({
      where: { apiKey },
    });

    if (!botData) {
      throw ApiError.UnauthorizedError();
    }

    const botDto = botData.toDto();

    return botDto;
  }
}
