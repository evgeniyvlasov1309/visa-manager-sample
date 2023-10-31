import type { User } from "@pages/auth/auth-types";
import UserService from "@pages/users/user-service";
import { create } from "zustand";
import type { UsersStore } from "./types";

const initialState = {
    users: [],
    selected: [],
    total: 0,
    loading: true,
    page: 0,
    limit: 50,
    current: null,
    filter: {
        type: "",
        search: "",
    },
};

export const useUsersStore = create<UsersStore>((set, get) => ({
    ...initialState,
    updateFilter: (filter) => {
        set({ filter });
    },
    updateUser: async (id, user) => {
        await UserService.updateUser(id, user);
        const targetIndex = get().users.findIndex((u) => u.id === user.id);
        const newUsers = get().users.slice();
        newUsers[targetIndex] = user;
        set({ users: newUsers });
    },
    getUser: async (id) => {
        const user = await UserService.getUser(id);
        set({ current: user });
    },
    fetchItems: async (filter, page, limit) => {
        if (page === 0) {
            get().resetPage();
        }
        set({ loading: true });

        UserService.getUsers({
            ...filter,
            offset: page * limit,
            limit,
        })
            .then(({ count, rows }) => {
                set({ total: count });
                return rows;
            })
            .then((data) => {
                set((state) => ({ users: [...state.users, ...data] }));
            })
            .finally(() => set({ loading: false, page: page + 1 }));
    },
    setUsers: (value: User[]) => set({ users: value }),
    reset: () => set(initialState),
    resetPage: () => set({ page: 0, users: [], total: 0 }),
    setCurrent: (value: Nullable<User>) => set({ current: value }),
}));
