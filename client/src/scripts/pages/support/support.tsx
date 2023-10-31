import telegramIcon from "@assets/icons/tg.svg";
import whatsAppIcon from "@assets/icons/whatsapp.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@shared/components/ui/Button/Button";
import Card from "@shared/components/ui/Card/Card";
import { TextField } from "@shared/components/ui/TextField/TextField";
import { TextArea } from "@shared/components/ui/Textarea/Textarea";
import WithLoading from "@shared/components/utility/WithLoading/WIthLoading";
import withHookFormMask from "@shared/utilities/validation/withHookFormMask";
import { supportSchema } from "@shared/utilities/validation/yap";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SupportService from "./support-service";
import "./support.scss";
import type { SupportRequest } from "./types";

export default function SupportPage() {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { isValid, errors },
    } = useForm<SupportRequest>({
        resolver: yupResolver(supportSchema),
    });

    async function onSubmit(data: SupportRequest) {
        setLoading(true);
        try {
            data.phoneNumber = "7" + data.phoneNumber;
            await SupportService.createSupportTicket(data);
            alert("Заявка успешно отправлена");
            reset();
        } catch (error) {
            alert("Непредвиденная ошибка");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="h1">Служба поддержки</h1>

            <WithLoading loading={loading}>
                <form
                    className="support-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Card>
                        <>
                            <div className="support-form__subtitle">
                                Есть вопросы? Опишите Вашу проблему и мы
                                свяжемся с Вами в ближайшее время
                            </div>
                            <div className="support-form__content">
                                <div className="support-form__fields">
                                    <TextField
                                        {...register(`firstName`)}
                                        errorMessage={
                                            errors.firstName?.message as string
                                        }
                                        label="Имя"
                                        placeholder="Введите имя"
                                    />
                                    <TextField
                                        {...register(`surname`)}
                                        errorMessage={
                                            errors.surname?.message as string
                                        }
                                        label="Фамилия"
                                        placeholder="Введите фамилию"
                                    />
                                    <TextField
                                        {...withHookFormMask(
                                            register("phoneNumber"),
                                            "+7(999)999-99-99",
                                            {
                                                autoUnmask: true,
                                                placeholder: "_",
                                                showMaskOnHover: true,
                                                showMaskOnFocus: true,
                                                onBeforePaste: (
                                                    pastedValue,
                                                    opts
                                                ) => pastedValue.slice(-10),
                                            }
                                        )}
                                        placeholder="+7"
                                        errorMessage={
                                            errors.phoneNumber
                                                ?.message as string
                                        }
                                        label="Номер телефона"
                                    />
                                    <TextField
                                        {...register(`email`)}
                                        errorMessage={
                                            errors.email?.message as string
                                        }
                                        label="Электронная почта"
                                        placeholder="Введите адрес электронной почты"
                                    />
                                </div>

                                <TextArea
                                    {...register(`comment`)}
                                    errorMessage={
                                        errors.comment?.message as string
                                    }
                                    label="Ваш комментарий"
                                    placeholder="Опишите Вашу проблему"
                                />
                            </div>
                        </>
                    </Card>
                    <div className="buttons-container">
                        <Button
                            type="submit"
                            disabled={!isValid}
                            dense
                            title="Отправить"
                        />
                        <div className="support-form__feedback-info">
                            <span>Другие способы связаться с нами:</span>
                            <a href="https://wa.link/60zu6o">
                                <img
                                    src={whatsAppIcon}
                                    width="37"
                                    height="37"
                                    alt="whatsapp"
                                />
                            </a>
                            <a href="https://t.me/visabroker_official">
                                <img
                                    src={telegramIcon}
                                    width="37"
                                    height="37"
                                    alt="telegram"
                                />
                            </a>
                        </div>
                    </div>
                </form>
            </WithLoading>
        </>
    );
}
