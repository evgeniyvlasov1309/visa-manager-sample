import type { User } from "@pages/auth/auth-types";

export interface TableFilterState {
    type: string;
    sort: string;
    search: string;
}

export interface BotOwnersStore {
    users: User[];
    total: number;
    page: number;
    limit: number;
    loading: boolean;
    filter: TableFilterState;
    current: Nullable<User>;
    fetchItems: (filter: TableFilterState, page: number, limit: number) => void;
    updateUser: (id: number, user: User) => void;
    updateFilter: (filter: TableFilterState) => void;
    reset: () => void;
    setUsers: (value: User[]) => void;
    setCurrent: (value: Nullable<User>) => void;
    resetPage: () => void;
}
