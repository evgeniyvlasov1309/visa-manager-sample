import { create } from "zustand";
import AdminService from "./admin-service";
import type { Bot, BotRequest } from "./types";

export interface AdminStore {
    loading: boolean;
    bots: Bot[];
    error: Nullable<string>;
    createBot: (req: BotRequest) => void;
    getBots: () => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
    loading: false,
    error: null,
    bots: [],
    createBot: async ({ country }) => {
        try {
            set({ loading: true });
            await AdminService.createBot({
                country,
            });
            set({ error: null });
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            const message = (error as Error).message;
            set({ error: message });
            throw new Error(message);
        }
    },
    getBots: async () => {
        try {
            set({ loading: true });
            const result = await AdminService.getBots();
            set({ bots: result });
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },
}));
