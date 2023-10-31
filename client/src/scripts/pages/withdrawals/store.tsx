import { create } from "zustand";
import type { Withdrawal, WithdrawalsStore } from "./types";
import WithdrawalService from "./withdrawal-service";

const initialState = {
    withdrawals: [],
    selected: [],
    total: 0,
    loading: true,
    page: 0,
    limit: 50,
    current: null,
    filter: {
        sort: "createdAt_ASC",
        status: "",
        userId: "",
        paidToBotOwnerStatus: "",
    },
};

export const useWithdrawasStore = create<WithdrawalsStore>((set, get) => ({
    ...initialState,
    updateFilter: (filter) => {
        set({ filter });
    },
    fetchItems: async (filter, page, limit) => {
        if (page === 0) {
            get().resetPage();
        }
        set({ loading: true });

        WithdrawalService.getItems({
            ...filter,
            offset: page * limit,
            limit,
        })
            .then(({ count, rows }) => {
                set({ total: count });
                return rows;
            })
            .then((data) => {
                set((state) => ({
                    withdrawals: [...state.withdrawals, ...data],
                }));
            })
            .finally(() => set({ loading: false, page: page + 1 }));
    },
    deleteItem: async (id: number) => {
        await WithdrawalService.removeItem(id);
        set((state) => ({
            withdrawals: state.withdrawals.filter((item) => item.id !== id),
        }));
    },
    setWithdrawals: (value: Withdrawal[]) => set({ withdrawals: value }),
    setSelected: (value: number[]) => set({ selected: value }),
    reset: () => set(initialState),
    resetPage: () => set({ page: 0, withdrawals: [], total: 0 }),
    setCurrent: (value: Nullable<Withdrawal>) => set({ current: value }),
}));
