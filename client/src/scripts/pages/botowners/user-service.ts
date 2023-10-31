import type { BotRequest } from "@pages/admin/types";
import type { User } from "@pages/auth/auth-types";
import type { PaginatedList } from "@pages/record/record.types";
import { Http } from "@shared/http";

export default class UserService {
    static async getUsers(query?: unknown) {
        return Http.get<PaginatedList<User>>("/users", {
            params: query,
        });
    }

    static async updateUser(data: User) {
        return Http.patch<User, User>(`/users`, data);
    }

    static async createPayment(data: number[]) {
        return Http.post<{ url: string }, number[]>("/payment", data);
    }

    static async createBot(data: BotRequest) {
        return Http.post<void, BotRequest>("/bot", data);
    }
}
