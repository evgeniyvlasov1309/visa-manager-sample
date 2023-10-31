import type { PaginatedList } from "@pages/record/record.types";
import { Http } from "@shared/http";
import type { Withdrawal } from "./types";

export default class WithdrawalService {
    static async createItem(data: number[]) {
        return Http.post<void, number[]>("/withdrawals", data);
    }

    static async removeItem(id: number) {
        return Http.delete<void>(`/withdrawals/${id}`);
    }

    static async editItem(id: number, withdrawalData: Withdrawal) {
        return Http.patch<void, Withdrawal>(
            `/withdrawals/${id}`,
            withdrawalData
        );
    }

    static async getItems(query?: unknown) {
        return Http.get<PaginatedList<Withdrawal>>("/withdrawals", {
            params: query,
        });
    }
}
