import type { BotOwnerStatictic } from "@pages/profile/types";
import { Http } from "@shared/http";
import type {
    PaginatedList,
    Price,
    Record,
    RecordRequest,
} from "./record.types";

export default class RecordService {
    static async createRecord(data: Omit<RecordRequest, "id">) {
        return Http.post<void, Omit<RecordRequest, "id">>("/records", data);
    }

    static async editRecord(id: number, data: RecordRequest) {
        return Http.patch<void, RecordRequest>(`/records/${id}`, data);
    }

    static async removeRecord(id: number) {
        return Http.delete<void>(`/records/${id}`);
    }

    static async getRecords(query?: unknown) {
        return Http.get<PaginatedList<Record>>("/records", {
            params: query,
        });
    }

    static async getRecord(id: number) {
        return Http.get<Record>(`/records/${id}`);
    }

    static async getPrices() {
        return Http.get<Price[]>(`/prices`);
    }

    static async updatePrices(data: Price[]) {
        return Http.post<Price[], Price[]>(`/prices`, data);
    }

    static async getBotOwnerStatistics(id: number) {
        return Http.post<BotOwnerStatictic[], { id: number }>(`/statistics`, {
            id,
        });
    }
}
