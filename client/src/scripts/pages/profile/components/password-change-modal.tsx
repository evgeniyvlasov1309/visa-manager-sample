import { yupResolver } from "@hookform/resolvers/yup";
import type { PasswordChangeRequestRequestFormData } from "@pages/auth/auth-types";
import { useAuthStore } from "@pages/auth/store";
import { Button } from "@shared/components/ui/Button/Button";
import Modal from "@shared/components/ui/Modal/Modal";
import { TextField } from "@shared/components/ui/TextField/TextField";
import { passwordChangeSchema } from "@shared/utilities/validation/yap";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./password-change-modal.scss";

export interface PasswordChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PasswordChangeModal({
    isOpen,
    onClose,
}: PasswordChangeModalProps) {
    const [changePassword] = useAuthStore((state) => [state.changePassword]);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordChangeRequestRequestFormData>({
        resolver: yupResolver(passwordChangeSchema),
    });

    async function onSubmit(data: PasswordChangeRequestRequestFormData) {
        const { repeatPassword, ...targetData } = data;
        try {
            await changePassword(targetData);
            setIsSuccess(true);
        } catch (e) {
            /* empty */
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="change-password-modal"
            >
                {isSuccess ? (
                    <div className="change-password-modal__success">
                        <h3>Пароль успешно изменен</h3>
                        <Button title="Закрыть" dense onClick={onClose} />
                    </div>
                ) : (
                    <>
                        <h3>Изменение пароля</h3>
                        <TextField
                            type="password"
                            {...register("password")}
                            errorMessage={errors.password?.message as string}
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
                        <Button type="submit" dense title={"Подтвердить"} />
                    </>
                )}
            </form>
        </Modal>
    );
}
