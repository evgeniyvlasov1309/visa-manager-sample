import type { User } from "@pages/auth/auth-types";

export interface TableFilterState {
    type: string;
    search: string;
}

export interface UsersStore {
    users: User[];
    total: number;
    page: number;
    limit: number;
    loading: boolean;
    filter: TableFilterState;
    current: Nullable<User>;
    getUser: (id: string) => void;
    fetchItems: (filter: TableFilterState, page: number, limit: number) => void;
    updateUser: (id: number, user: User) => void;
    updateFilter: (filter: TableFilterState) => void;
    reset: () => void;
    setUsers: (value: User[]) => void;
    setCurrent: (value: Nullable<User>) => void;
    resetPage: () => void;
}

export interface PaymentRequest {
    type: "cash" | "card";
    selected: number[];
    code: number;
    comment: string;
}

export interface Price {
    id: number;
    label: string;
    value: string;
    priceStandardCapital: number;
    priceStandardRegion: number;
    capitals: string[];
}
