import type { PaginatedList } from "@pages/record/record.types";
import { Http } from "@shared/http";
import type { Notification } from "./types";

export default class NotificationService {
    static async fetchItems(query?: unknown) {
        return Http.get<PaginatedList<Notification>>("/notifications", {
            params: query,
        });
    }

    static async markAsRead(id: number) {
        return Http.patch<void, { delivered: true }>(`/notifications/${id}`, {
            delivered: true,
        });
    }
}
