import chinaFlag from "@assets/icons/china.svg";
import type { User, UserRequest } from "@pages/auth/auth-types";
import { useAuthStore } from "@pages/auth/store";
import UserService from "@pages/users/user-service";
import CountryChip from "@shared/components/filters/CountryFilter/components/CountryChip/CountryChip";
import { Button } from "@shared/components/ui/Button/Button";
import { TextField } from "@shared/components/ui/TextField/TextField";
import WithLoading from "@shared/components/utility/WithLoading/WIthLoading";
import withHookFormMask from "@shared/utilities/validation/withHookFormMask";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./permanent-fields.scss";

export default function PermanentFieldsPage() {
    const [loading, setLoading] = useState(false);
    const [user, checkAuth] = useAuthStore((state) => [
        state.user,
        state.checkAuth,
    ]);

    const {
        register,
        handleSubmit,
        formState: { isValid, errors },
    } = useForm<UserRequest>({
        defaultValues: user as User,
    });

    async function onSubmit(data: UserRequest) {
        setLoading(true);
        try {
            if (!user?.id) return;
            await UserService.updateUser(user.id, data);
            checkAuth();
            setLoading(false);
        } catch (error) {
            alert(error);
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="h1">Постоянные данные</h1>
            <div className="country-filter">
                <CountryChip
                    label="Китай"
                    active={true}
                    img={chinaFlag}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onClick={() => {}}
                />
            </div>

            <WithLoading loading={loading}>
                <form className="fields-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="fields-form__fields">
                        <TextField
                            type="text"
                            {...withHookFormMask(
                                register(`permanentFields.firstName`),
                                "",
                                {
                                    regex: "[A-Za-z]*",
                                    showMaskOnHover: false,
                                    autoUnmask: true,
                                    onUnMask: (value) => value.toUpperCase(),
                                }
                            )}
                            uppercase
                            errorMessage={
                                errors.secretFields?.firstName
                                    ?.message as string
                            }
                            label="Имя (латиницей)"
                            placeholder="Введите имя"
                        />
                        <TextField
                            type="text"
                            {...withHookFormMask(
                                register(`permanentFields.surname`),
                                "",
                                {
                                    regex: "[A-Za-z]*",
                                    showMaskOnHover: false,
                                    autoUnmask: true,
                                    onUnMask: (value) => value.toUpperCase(),
                                }
                            )}
                            uppercase
                            errorMessage={
                                errors.secretFields?.surname?.message as string
                            }
                            label="Фамилия (латиницей)"
                            placeholder="Введите фамилию"
                        />
                        <TextField
                            type="text"
                            {...withHookFormMask(
                                register(`permanentFields.phoneNumber`),
                                "+7(999)999-99-99",
                                {
                                    autoUnmask: true,
                                    placeholder: "_",
                                    showMaskOnHover: true,
                                    onBeforePaste: (pastedValue, opts) =>
                                        pastedValue.slice(-10),
                                }
                            )}
                            placeholder="+7"
                            errorMessage={
                                errors.secretFields?.phoneNumber
                                    ?.message as string
                            }
                            label="Контактный номер телефона"
                        />
                        <TextField
                            type="text"
                            {...register(`permanentFields.email`)}
                            errorMessage={
                                errors.secretFields?.email?.message as string
                            }
                            label="Электронная почта"
                            placeholder="Введите адрес электронной почты"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={!isValid}
                        dense
                        title="Сохранить"
                    />
                </form>
            </WithLoading>
        </>
    );
}
