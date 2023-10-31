import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@shared/components/ui/Button/Button";
import { TextField } from "@shared/components/ui/TextField/TextField";
import WithLoading from "@shared/components/utility/WithLoading/WIthLoading";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuthStore } from "@pages/auth/store";
import {
    emailSchemaSchema,
    resetPasswordSchema,
} from "@shared/utilities/validation/yap";
import { useLocation, useNavigate } from "react-router-dom";
import "./resetPassword.scss";
import type { ResetPasswordRequestFormData } from "./types";

export function ResetPassword() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [email, setEmail] = useState("");
    const token = queryParams.get("token");

    const [isResetPwdMode] = useState(!!token);
    const [isGetLinkMode, setIsGetLinkMode] = useState(!token);
    const [isConfirmationMode, setConfirmationMode] = useState(false);
    const navigate = useNavigate();

    const [error, loading, getResetPasswordLink, resetPassword] = useAuthStore(
        (state) => [
            state.error,
            state.loading,
            state.getResetPasswordLink,
            state.resetPassword,
        ]
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordRequestFormData>({
        resolver: isGetLinkMode
            ? yupResolver(emailSchemaSchema)
            : yupResolver(resetPasswordSchema),
    });

    async function onGetResetPasswordLinkSubmit(data: { email: string }) {
        try {
            await getResetPasswordLink(data.email);
            setIsGetLinkMode(false);
            setConfirmationMode(true);
        } catch (e) {
            /* empty */
        }
    }

    async function onResetPasswordSubmit(data: { password: string }) {
        try {
            if (!token) return;
            await resetPassword(data.password, token);
            alert("Пароль успешно сменен");
            navigate("/auth");
        } catch (e) {
            /* empty */
        }
    }

    async function onSubmit(data: ResetPasswordRequestFormData) {
        if (isGetLinkMode) {
            setEmail(data.email);
            onGetResetPasswordLinkSubmit({ email: data.email });
        } else {
            onResetPasswordSubmit({ password: data.password });
        }
    }

    return (
        <>
            {!isConfirmationMode && (
                <>
                    <h1 className="h1 auth-page__title">
                        Сервис записи в визовые центры
                    </h1>
                    <p className="p auth-page__label">Восстановление пароля</p>
                </>
            )}
            <WithLoading loading={loading}>
                <>
                    {isConfirmationMode && (
                        <div className="p auth-page__label">
                            На адрес {email} было отправлено письмо для
                            подтверждения восстановления пароля. Если письмо не
                            придет в течение 5 минут, проверьте папку СПАМ.
                        </div>
                    )}

                    <form
                        className="auth-page__form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {isGetLinkMode && (
                            <TextField
                                type="email"
                                {...register("email")}
                                errorMessage={errors.email?.message as string}
                                autoFocus={true}
                                label="Электронная почта"
                                placeholder="Введите электронную почту"
                            />
                        )}

                        {isResetPwdMode && (
                            <>
                                <TextField
                                    type="password"
                                    {...register("password")}
                                    errorMessage={
                                        errors.password?.message as string
                                    }
                                    label="Пароль"
                                    placeholder="Введите пароль"
                                />

                                <TextField
                                    type="password"
                                    {...register("repeatPassword")}
                                    errorMessage={
                                        errors.repeatPassword?.message as string
                                    }
                                    label="Подтвердите пароль"
                                    placeholder="Введите пароль еще раз"
                                />
                            </>
                        )}

                        <div className="auth-page__form-buttons">
                            {isGetLinkMode && (
                                <Button
                                    type="submit"
                                    title="Восстановить пароль"
                                />
                            )}
                            {isResetPwdMode && (
                                <Button type="submit" title="Сменить пароль" />
                            )}
                        </div>
                        <div className="auth-page__form-error">{error}</div>
                    </form>
                </>
            </WithLoading>
        </>
    );
}
