import { Http } from "@shared/http";
import type { Bot, BotRequest } from "./types";

export default class AdminService {
    static async getBots() {
        return Http.get<Bot[]>("/bot");
    }

    static async createBot(data: BotRequest) {
        return Http.post<void, BotRequest>("/bot", data);
    }
}
