import { create } from "zustand";
import NotificationService from "./notification-service";
import type { NotificationsStore } from "./types";

const initialState = {
    undelivereditems: [],
    delivereditems: [],
    loading: false,
    showDelivered: false,
    offset: 0,
    limit: 50,
    error: "",
};

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
    ...initialState,
    fetchItems: async () => {
        set({ loading: true });

        NotificationService.fetchItems({
            delivered: get().showDelivered,
            offset: get().offset,
            limit: get().limit,
        })
            .then((data) => {
                if (get().showDelivered) {
                    set((state) => ({
                        delivereditems: data.rows,
                    }));
                } else {
                    set((state) => ({
                        undelivereditems: data.rows,
                    }));
                }
            })
            .finally(() => set({ loading: false }));
    },
    markAsRead: async (id: number) => {
        await NotificationService.markAsRead(id);
        get().fetchItems();
    },
    setShowDelivered: (value) => set({ showDelivered: value }),
}));
