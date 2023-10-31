import companyIcon from "@assets/icons/company.svg";
import personIcon from "@assets/icons/person.svg";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@shared/components/ui/Button/Button";
import { Checkbox } from "@shared/components/ui/Checkbox/Checkbox";
import { TextField } from "@shared/components/ui/TextField/TextField";
import WithLoading from "@shared/components/utility/WithLoading/WIthLoading";
import { authSchema, regSchema } from "@shared/utilities/validation/yap";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import type {
    AuthRequestFormData,
    User,
    UserType,
} from "@pages/auth/auth-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./auth.scss";
import { useAuthStore } from "./store";

export function Auth() {
    const [isUserTypeMode, setIsUserTypeMode] = useState(false);
    const [isConfirmationMode, setConfirmationMode] = useState(false);
    const [isDefaultMode, setIsDefaultMode] = useState(true);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const navigate = useNavigate();
    const [user, error, loading, login, registration, patchUser, resetError] =
        useAuthStore((state) => [
            state.user,
            state.error,
            state.loading,
            state.login,
            state.registration,
            state.patchUser,
            state.resetError,
        ]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const activated = queryParams.get("activated");

    const isHiddenAuth = location.pathname === "/auth";

    function onChangeMode() {
        resetError();
    }

    useEffect(() => {
        if (activated === "true") {
            alert(
                "Вы успешно зарегистрированы! Используйте электронную почту и пароль указанные при регистрации для входа в аккаунт"
            );
        }
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthRequestFormData>({
        resolver: isLoginMode
            ? yupResolver(authSchema)
            : yupResolver(regSchema),
    });

    async function onSubmit(data: AuthRequestFormData) {
        const { repeatPassword, ...targetData } = data;
        if (isLoginMode) {
            try {
                await login(targetData);
                navigate("/");
            } catch (e) {
                /* empty */
            }
        } else {
            try {
                await registration(targetData);
                setIsDefaultMode(false);
                setIsUserTypeMode(true);
            } catch (e) {
                /* empty */
            }
        }
    }

    async function onSelectUserType(type: UserType) {
        try {
            if (!user) return;
            await patchUser(user.id, {
                type,
                paymentMethod: type === "person" ? "card" : "cash",
            } as User);
            setIsUserTypeMode(false);
            setConfirmationMode(true);
        } catch (error) {
            setIsUserTypeMode(false);
            setIsDefaultMode(true);
        }
    }

    return (
        <>
            {!isHiddenAuth && !isConfirmationMode && (
                <>
                    <h1 className="h1 auth-page__title">
                        Сервис записи в визовые центры
                    </h1>
                    <p className="p auth-page__label">
                        {isUserTypeMode
                            ? "Выберите тип пользователя для продолжения регистрации"
                            : isLoginMode
                            ? "Войдите в систему для записи на подачу документов"
                            : "Зарегистрируйтесь в системе для записи на подачу документов"}
                    </p>
                </>
            )}
            <WithLoading loading={loading}>
                <>
                    {isConfirmationMode && (
                        <div className="p auth-page__label">
                            Спасибо за регистрацию! На адрес {user?.email} было
                            отправлено письмо для подтверждения регистрации.
                            Если письмо не придет в течение 5 минут, проверьте
                            папку СПАМ.
                        </div>
                    )}
                    {isUserTypeMode && (
                        <div className="auth-page__user-type-btns">
                            <Button
                                iconLeft={personIcon}
                                title="Частное лицо"
                                onClick={() => onSelectUserType("person")}
                            />
                            <Button
                                iconLeft={companyIcon}
                                title="Компания"
                                onClick={() => onSelectUserType("company")}
                            />
                            <Button
                                iconLeft={personIcon}
                                title="Разработчик"
                                onClick={() => onSelectUserType("botOwner")}
                            />
                        </div>
                    )}
                    {isDefaultMode && (
                        <form
                            className="auth-page__form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <TextField
                                type="email"
                                {...register("email")}
                                errorMessage={errors.email?.message as string}
                                autoFocus={true}
                                label="Электронная почта"
                                placeholder="Введите электронную почту"
                            />
                            <TextField
                                type="password"
                                {...register("password")}
                                errorMessage={
                                    errors.password?.message as string
                                }
                                label="Пароль"
                                placeholder="Введите пароль"
                            />
                            {!isLoginMode && (
                                <TextField
                                    type="password"
                                    {...register("repeatPassword")}
                                    errorMessage={
                                        errors.repeatPassword?.message as string
                                    }
                                    label="Подтвердите пароль"
                                    placeholder="Введите пароль еще раз"
                                />
                            )}

                            <div className="auth-page__form-tools">
                                <Checkbox
                                    rounded
                                    id="rememberMe"
                                    {...register("rememberMe")}
                                    label="Запомнить меня"
                                />
                                {isLoginMode && !isHiddenAuth && (
                                    <Link
                                        className="link"
                                        to="/reset-password"
                                        onClick={onChangeMode}
                                    >
                                        Забыл пароль
                                    </Link>
                                )}
                            </div>
                            <div className="auth-page__form-buttons">
                                <Button
                                    type="submit"
                                    title={
                                        isLoginMode
                                            ? "Войти"
                                            : "Зарегистрироваться"
                                    }
                                />
                                {!isHiddenAuth && (
                                    <Button
                                        variant="secondary"
                                        title={
                                            isLoginMode
                                                ? "Зарегистрироваться"
                                                : "Войти"
                                        }
                                        onClick={() => {
                                            resetError();
                                            setIsLoginMode((prev) => !prev);
                                        }}
                                    />
                                )}
                            </div>
                            <div className="auth-page__form-error">{error}</div>
                        </form>
                    )}
                </>
            </WithLoading>
        </>
    );
}
