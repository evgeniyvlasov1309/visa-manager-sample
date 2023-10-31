import { create } from "zustand";

export interface SearchStore {
    search: string;
    updateSearch: (value: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
    search: "",
    updateSearch: (value) => set({ search: value }),
}));
