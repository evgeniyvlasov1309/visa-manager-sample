import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "@pages/auth/auth-service";
import { useAuthStore } from "@pages/auth/store";
import { Button } from "@shared/components/ui/Button/Button";
import { TextField } from "@shared/components/ui/TextField/TextField";
import WithLoading from "@shared/components/utility/WithLoading/WIthLoading";
import { employeeSchema } from "@shared/utilities/validation/yap";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./employee.scss";
import type { CreateEmployeeRequest } from "./types";

export function EmployeePage() {
    const [loading, setLoading] = useState(false);

    const [patchUser, user] = useAuthStore((state) => [
        state.patchUser,
        state.user,
    ]);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { isValid, errors },
    } = useForm<CreateEmployeeRequest>({
        resolver: yupResolver(employeeSchema),
    });

    async function onSubmit(data: CreateEmployeeRequest) {
        setLoading(true);
        try {
            const { user: newEmployee } = await AuthService.registration({
                email: data.email,
                password: data.password,
            });
            if (!user) return;
            await patchUser(newEmployee.id, {
                ...newEmployee,
                type: "person",
                agencyId: user.id,
                paymentMethod: "cash",
                fio: data.fio,
                telegram: data.telegram,
            });
            alert("Сотрудник успешно создан");
            navigate("/employees");
        } catch (error) {
            alert("Непредвиденная ошибка");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="h1">Добавить сотрудника</h1>
            <WithLoading loading={loading}>
                <form
                    className="employee-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="employee-form__fields">
                        <TextField
                            type="text"
                            {...register(`fio`)}
                            errorMessage={errors.fio?.message as string}
                            label="ФИО*"
                            placeholder="Введите ФИО"
                        />
                        <TextField
                            type="text"
                            {...register(`telegram`)}
                            errorMessage={errors.telegram?.message as string}
                            label="Телеграм"
                            placeholder="Укажите ник в телеграм"
                        />
                        <TextField
                            type="email"
                            {...register("email")}
                            errorMessage={errors.email?.message as string}
                            autoFocus={true}
                            label="Электронная почта*"
                            placeholder="Введите электронную почту"
                        />
                        <TextField
                            type="password"
                            {...register("password")}
                            errorMessage={errors.password?.message as string}
                            label="Пароль*"
                            placeholder="Введите пароль"
                        />
                        {/* <TextField
                            {...withHookFormMask(
                                register(`phoneNumber`),
                                "+7(999)999-99-99",
                                {
                                    autoUnmask: true,
                                    placeholder: "_",
                                    showMaskOnHover: true,
                                }
                            )}
                            placeholder="+7"
                            hidden={!activeFields.includes("phoneNumber")}
                            errorMessage={
                                errors.applicants?.[index]?.phoneNumber
                                    ?.message as string
                            }
                            label="Контактный номер телефона"
                        /> */}
                    </div>
                    <Button
                        type="submit"
                        disabled={!isValid}
                        dense
                        title="сохранить"
                    />
                </form>
            </WithLoading>
        </>
    );
}
