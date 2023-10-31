import UserService from "@pages/users/user-service";
import { create } from "zustand";
import AuthService from "./auth-service";
import type { AuthRequest, PasswordChangeRequest, User } from "./auth-types";

export interface AuthStore {
    user: Nullable<User>;
    users: User[];
    loading: boolean;
    error: Nullable<string>;
    login: (req: AuthRequest) => void;
    registration: (req: AuthRequest) => void;
    patchUser: (id: number, data: User) => void;
    logout: () => void;
    checkAuth: () => void;
    getResetPasswordLink: (email: string) => void;
    resetPassword: (password: string, resetPasswordLink: string) => void;
    getUsers: () => void;
    resetError: () => void;
    changePassword: (req: PasswordChangeRequest) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    users: [],
    user: null,
    loading: false,
    error: null,
    changePassword: async ({ password }) => {
        try {
            set({ loading: true });
            AuthService.changePassword({ password });
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            const message = (error as Error).message;
            set({ error: message });
            throw new Error(message);
        }
    },
    login: async ({ email, password, rememberMe }) => {
        try {
            set({ loading: true });
            const { user, accessToken } = await AuthService.login({
                email,
                password,
            });
            AuthService.saveToken(accessToken, rememberMe);
            set({ user });
            set({ error: null });
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            const message = (error as Error).message;
            set({ error: message });
            throw new Error(message);
        }
    },
    registration: async ({ email, password, rememberMe }) => {
        try {
            set({ loading: true });
            const { user, accessToken } = await AuthService.registration({
                email,
                password,
            });
            AuthService.saveToken(accessToken, rememberMe);
            set({ user });
            set({ error: null });
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            const message = (error as Error).message;
            set({ error: message });
            throw new Error(message);
        }
    },
    patchUser: async (id: number, data: User) => {
        try {
            set({ loading: true });
            const user = get().user;
            if (!user) {
                throw new Error("Пользователь не найден");
            }
            const updatedUser = await UserService.updateUser(id, {
                ...user,
                ...data,
            });
            set({ user: updatedUser });
            set({ error: null });
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            const message = (error as Error).message;
            set({ error: message });
            throw new Error(message);
        }
    },
    logout: async () => {
        try {
            await AuthService.logout();
            AuthService.removeToken();
            set({ user: null });
        } catch (error) {
            const message = (error as Error).message;
            set({ error: message });
            throw new Error(message);
        }
    },
    checkAuth: async () => {
        const user = await AuthService.checkAuth();
        set({ user });
    },
    getResetPasswordLink: async (email: string) => {
        try {
            set({ loading: true });
            await AuthService.getResetPasswordLink({ email });
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            const message = (error as Error).message;
            set({ error: message });
            throw new Error(message);
        }
    },
    resetPassword: async (password: string, resetPasswordToken: string) => {
        try {
            set({ loading: true });
            await AuthService.resetPassword({ password, resetPasswordToken });
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            const message = (error as Error).message;
            set({ error: message });
            throw new Error(message);
        }
    },
    getUsers: async () => {
        try {
            const users = await AuthService.getUsers();
            set({ users: users });
        } catch (error) {
            console.log(error);
        }
    },
    resetError: () => set({ error: null }),
}));
