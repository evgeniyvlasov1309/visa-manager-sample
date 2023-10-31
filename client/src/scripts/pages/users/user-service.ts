import type { BotRequest } from "@pages/admin/types";
import type { User } from "@pages/auth/auth-types";
import type { PaginatedList } from "@pages/record/record.types";
import { Http } from "@shared/http";
import type { PaymentRequest, Price } from "./types";

export default class UserService {
    static async getUsers(query?: unknown) {
        return Http.get<PaginatedList<User>>("/users", {
            params: query,
        });
    }

    static async getUser(id: string) {
        return Http.get<User>(`/users/${id}`);
    }

    static async updateUser(id: number, data: User) {
        return Http.patch<User, User>(`/users/${id}`, data);
    }

    static async createPayment(data: PaymentRequest) {
        return Http.post<{ url: string }, PaymentRequest>("/payment", data);
    }

    static async createBot(data: BotRequest) {
        return Http.post<void, BotRequest>("/bot", data);
    }

    static async getPrices(id: number) {
        return Http.get<Price[]>(`/users/${id}/prices`);
    }

    static async updatePrices(id: number, data: Price[]) {
        return Http.post<Price[], Price[]>(`/users/${id}/prices`, data);
    }
}
