import { Http } from "@shared/http";
import type { SupportRequest } from "./types";

export default class SupportService {
    static async createSupportTicket(data: SupportRequest) {
        return Http.post<void, SupportRequest>("/support", data);
    }
}
