import type { AxiosRequestConfig, AxiosResponse } from "axios";

export type HttpResponse<T> = Promise<AxiosResponse<T>>;

export type ReqConfigWithRetry =
    | (AxiosRequestConfig & { _isRetry: boolean })
    | undefined;

export type HttpError = {
    message: string;
};
