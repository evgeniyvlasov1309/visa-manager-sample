import { API_URL, Http } from "@shared/http";
import axios from "axios";

import type {
    AuthRequest,
    AuthResponse,
    PasswordChangeRequest,
    User,
} from "@pages/auth/auth-types";
import type {
    GetResetLinkRequest,
    ResetPasswordRequest,
} from "@pages/reset-password/types";

export default class AuthService {
    static async login(data: AuthRequest) {
        return Http.post<AuthResponse, AuthRequest>("/login", data);
    }

    static async registration(data: AuthRequest) {
        return Http.post<AuthResponse, AuthRequest>("/registration", data);
    }

    static async logout() {
        return Http.get<void>("/logout");
    }

    static async checkAuth() {
        const {
            data: { user, accessToken },
        } = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
            withCredentials: true,
        });
        AuthService.saveToken(accessToken);
        return user;
    }

    static async getResetPasswordLink(data: { email: string }) {
        await Http.post<void, GetResetLinkRequest>(
            "/reset-password-link",
            data
        );
    }

    static async resetPassword(data: {
        password: string;
        resetPasswordToken: string;
    }) {
        await Http.post<void, ResetPasswordRequest>("/reset-password", data);
    }

    static async changePassword(data: PasswordChangeRequest) {
        await Http.post<void, PasswordChangeRequest>("/change-password", data);
    }

    static saveToken(accessToken: string, remeberMe?: boolean) {
        if (remeberMe) {
            localStorage.setItem("rememberMe", "true");
        } else if (remeberMe === false) {
            localStorage.removeItem("rememberMe");
        }

        const rememberMeFlag = localStorage.getItem("rememberMe");

        (rememberMeFlag ? localStorage : sessionStorage).setItem(
            "token",
            accessToken
        );
    }

    static getToken() {
        const tokenFromLS = localStorage.getItem("token");
        const tokenFromSS = sessionStorage.getItem("token");

        return tokenFromLS || tokenFromSS;
    }

    static removeToken() {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
    }

    static async getUsers() {
        return Http.get<User[]>("/users");
    }
}
