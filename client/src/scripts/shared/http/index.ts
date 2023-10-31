import AuthService from "@pages/auth/auth-service";

import axios from "axios";

import type { ReqConfigWithRetry } from "@shared/http/types";
import type { AxiosError, RawAxiosRequestConfig } from "axios";

export const API_URL = "/api";

export const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
    if (config && config.headers) {
        const token = AuthService.getToken();
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (config && config.params) {
        for (const key of Object.keys(config.params)) {
            if (config.params[key] === "") {
                delete config.params[key];
            }
        }
    }
    return config;
});

$api.interceptors.response.use(
    (config) => config.data,
    async (error: AxiosError) => {
        const originalRequest = error.config as ReqConfigWithRetry;
        const status = error?.response?.status;
        const message = (error.response?.data as Error).message;
        console.log(error);
        if (!status) {
            throw new Error("Непредвиденная ошибка");
        }

        switch (status) {
            case 401:
                if (originalRequest && !originalRequest._isRetry) {
                    originalRequest._isRetry = true;
                    try {
                        await AuthService.checkAuth();

                        if (originalRequest) {
                            return $api.request(originalRequest);
                        }
                    } catch (error) {
                        window.location.href = "/auth";
                    }
                }
                break;
            default:
                throw new Error(message);
        }

        throw error;
    }
);

export class Http {
    static get<T>(url: string, config?: RawAxiosRequestConfig) {
        return $api.get<unknown, T>(url, config);
    }

    static post<T, D>(url: string, data: D, config?: RawAxiosRequestConfig) {
        return $api.post<unknown, T, D>(url, data, config);
    }

    static patch<T, D>(url: string, data: D, config?: RawAxiosRequestConfig) {
        return $api.patch<unknown, T, D>(url, data, config);
    }

    static delete<T>(url: string, config?: RawAxiosRequestConfig) {
        return $api.delete<unknown, T>(url, config);
    }
}
