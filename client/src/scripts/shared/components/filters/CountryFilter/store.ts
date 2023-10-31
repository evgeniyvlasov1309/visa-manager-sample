import { create } from "zustand";
import type { CountryFilterStore } from "./types";

const initialState = {
    country: "",
};

export const useCountryFilterStore = create<CountryFilterStore>((set, get) => ({
    ...initialState,
    setCountry: (country: string) => {
        set({ country });
    },
}));
