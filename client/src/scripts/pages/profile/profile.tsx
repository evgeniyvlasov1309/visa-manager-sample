import chinaFlag from "@assets/icons/china.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import type { User, UserRequest } from "@pages/auth/auth-types";
import { useAuthStore } from "@pages/auth/store";
import { useRecordsStore } from "@pages/home/store";
import { useUsersStore } from "@pages/users/store";
import type { Price } from "@pages/users/types";
import UserService from "@pages/users/user-service";
import CountryChip from "@shared/components/filters/CountryFilter/components/CountryChip/CountryChip";
import { Button } from "@shared/components/ui/Button/Button";
import EditInput from "@shared/components/ui/EditInput/EditInput";
import { TextField } from "@shared/components/ui/TextField/TextField";
import WithLoading from "@shared/components/utility/WithLoading/WIthLoading";
import { getCurrentMonthYear } from "@shared/utilities/getCurrentMonthYear";
import withHookFormMask from "@shared/utilities/validation/withHookFormMask";
import {
    userAdminSchema,
    userBotOwnerSchema,
    userCompanySchema,
    userIndividualSchema,
} from "@shared/utilities/validation/yap";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Toggle from "react-toggle";
import { PasswordChangeModal } from "./components/password-change-modal";
import "./profile.scss";

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState("");
    const [user, checkAuth] = useAuthStore((state) => [
        state.user,
        state.checkAuth,
    ]);
    const [agencyUser, setAgencyUser] = useState<Nullable<User>>(null);
    const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
        useState(false);
    const [
        initialPrices,
        botOwnerStatistics,
        updatePrices,
        fetchPrices,
        fetchBotOwnerStatistics,
    ] = useRecordsStore((state) => [
        state.prices,
        state.botOwnerStatistics,
        state.updatePrices,
        state.fetchPrices,
        state.fetchBotOwnerStatistics,
    ]);

    const [prices, setPrices] = useState(initialPrices);
    const [userPrices, setUserPrices] = useState<Price[]>([]);

    useEffect(() => {
        if (user?.agencyId) {
            UserService.getUser(user.agencyId.toString()).then((u) =>
                setAgencyUser(u)
            );
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        let newUserPrices = JSON.parse(user.prices) as Price[];
        if (user.agencyId && agencyUser) {
            newUserPrices = JSON.parse(agencyUser.prices) as Price[];
        }
        if (prices.length) {
            newUserPrices = newUserPrices.map((p, i) => ({
                ...p,
                priceStandardCapital:
                    p.priceStandardCapital || prices[i].priceStandardCapital,
                priceStandardRegion:
                    p.priceStandardRegion || prices[i].priceStandardRegion,
            }));
        }
        setUserPrices(newUserPrices);
    }, [user, prices, agencyUser]);

    useEffect(() => {
        if (user?.type === "botOwner") {
            fetchBotOwnerStatistics(user.id);
        }
        if (!initialPrices.length) {
            fetchPrices();
        }
        setPrices(initialPrices);
    }, [initialPrices]);

    const validationSchema = user?.isAdmin
        ? userAdminSchema
        : user?.type === "person"
        ? userIndividualSchema
        : user?.type === "botOwner"
        ? userBotOwnerSchema
        : userCompanySchema;

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { isValid, errors },
    } = useForm<UserRequest>({
        defaultValues: {
            ...user,
        } as User,
        resolver: yupResolver(validationSchema),
    });

    const avatarImage = watch("avatar");

    const [editPriceMode, setEditPriceMode] = useState(false);

    const totalPercent = useMemo(() => {
        let totalSuccessRecords = 0;
        let totalRecords = 0;

        // Calculate the sum of successRecords and totalRecords
        botOwnerStatistics.forEach((stat) => {
            totalSuccessRecords += stat.successRecords;
            totalRecords += stat.totalRecords;
        });

        // Calculate the percentage
        return totalRecords ? (totalSuccessRecords / totalRecords) * 100 : 0;
    }, [botOwnerStatistics]);

    const totalIncome = useMemo(() => {
        let totalFinalIncome = 0;

        // Calculate the sum of successRecords and totalRecords
        botOwnerStatistics.forEach((stat) => {
            totalFinalIncome += stat.finalIncome;
        });

        // Calculate the percentage
        return totalFinalIncome;
    }, [botOwnerStatistics]);

    function onPriceSave() {
        if (!editPriceMode) return;
        updatePrices(prices);
        setEditPriceMode(false);
    }

    function onUpdatePrice(country: string, field: string, newValue: number) {
        const newPrices = prices.slice();
        const target = newPrices.find((price) => price.value === country);
        if (!target) return;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        target[field] = newValue;

        setPrices(newPrices);
    }

    async function onSubmit(data: UserRequest) {
        setLoading(true);
        try {
            if (!user?.id) return;
            await UserService.updateUser(user.id, data);
            checkAuth();
            if (user?.type !== "botOwner") {
                navigate("/");
            }
            setLoading(false);
        } catch (error) {
            alert(error);
            setLoading(false);
        }
    }

    function onAvatarClear(e: React.MouseEvent<HTMLSpanElement>) {
        e.preventDefault();
        setValue("avatar", "");
        setAvatar("");
    }

    function onAvatarSelected(value: React.ChangeEvent<HTMLInputElement>) {
        const file = value.target.files && value.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result as string;
                setValue("avatar", base64String);
            };

            reader.readAsDataURL(file);
        }
    }

    const [updateUser] = useUsersStore((state) => [state.updateUser]);

    type NotificationParam =
        | "notificationEmail"
        | "notificationTelegram"
        | "notificationEmailEnabled"
        | "notificationTelegramEnabled";

    const onUpdateUserNotificationParams = async (
        field: NotificationParam,
        value: string | boolean
    ) => {
        if (!user) return;

        await updateUser(user.id, {
            ...user,
            [field]: value,
        });

        checkAuth();
    };

    async function generateBot(country: string) {
        if (!user?.id) return;

        await UserService.createBot({
            userId: user.id,
            country,
        });

        await fetchBotOwnerStatistics(user.id);
    }

    return (
        <>
            <h1 className="h1">
                Профиль{" "}
                {user?.isAdmin
                    ? "администратора"
                    : user?.type === "company"
                    ? "компании"
                    : user?.type === "person"
                    ? user?.agencyId
                        ? "сотрудника компании"
                        : "частного лица"
                    : "разработчика"}
            </h1>
            <WithLoading loading={loading}>
                <form
                    className="profile-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <label className="profile-form__avatar">
                        {!avatarImage && (
                            <span className="profile-form__avatar-label">
                                Выберите аватар
                            </span>
                        )}
                        {avatarImage && (
                            <>
                                <span
                                    className="profile-form__avatar-clear"
                                    onClick={onAvatarClear}
                                >
                                    &#10006;
                                </span>
                                <img
                                    className="profile-form__avatar-image"
                                    src={avatarImage}
                                    width="100px"
                                    height="100px"
                                    alt="avatar"
                                />
                            </>
                        )}

                        <input
                            className="profile-form__avatar-input visually-hidden"
                            type="file"
                            accept="image/*"
                            value={avatar}
                            onChange={onAvatarSelected}
                        />
                    </label>

                    <div className="profile-form__fields">
                        {user?.isAdmin && (
                            <>
                                <TextField
                                    type="text"
                                    {...register(`fio`)}
                                    errorMessage={errors.fio?.message as string}
                                    label="ФИО*"
                                    placeholder="Введите ФИО"
                                />
                                <TextField
                                    type="email"
                                    {...register(`email`)}
                                    disabled
                                    errorMessage={
                                        errors.email?.message as string
                                    }
                                    label="Электронная почта"
                                    placeholder="Введите адрес электронной почты"
                                />
                                <h3
                                    className="profile-form__subtitle"
                                    style={{ gridColumn: "1 / 5" }}
                                >
                                    Подменные поля
                                </h3>
                                <div
                                    className="country-filter"
                                    style={{ gridColumn: "1 / 5" }}
                                >
                                    <CountryChip
                                        label="Китай"
                                        active={true}
                                        img={chinaFlag}
                                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                                        onClick={() => {}}
                                    />
                                </div>
                                <TextField
                                    type="text"
                                    {...withHookFormMask(
                                        register(`secretFields.firstName`),
                                        "",
                                        {
                                            regex: "[A-Za-z]*",
                                            showMaskOnHover: false,
                                            autoUnmask: true,
                                            onUnMask: (value) =>
                                                value.toUpperCase(),
                                        }
                                    )}
                                    uppercase
                                    errorMessage={
                                        errors.secretFields?.firstName
                                            ?.message as string
                                    }
                                    label="Имя подающего лица (латиницей)"
                                    placeholder="Введите имя"
                                />
                                <TextField
                                    type="text"
                                    {...withHookFormMask(
                                        register(`secretFields.surname`),
                                        "",
                                        {
                                            regex: "[A-Za-z]*",
                                            showMaskOnHover: false,
                                            autoUnmask: true,
                                            onUnMask: (value) =>
                                                value.toUpperCase(),
                                        }
                                    )}
                                    uppercase
                                    errorMessage={
                                        errors.secretFields?.surname
                                            ?.message as string
                                    }
                                    label="Фамилия подающего лица (латиницей)"
                                    placeholder="Введите фамилию"
                                />
                                <TextField
                                    type="text"
                                    {...withHookFormMask(
                                        register(`secretFields.phoneNumber`),
                                        "+7(999)999-99-99",
                                        {
                                            autoUnmask: true,
                                            placeholder: "_",
                                            showMaskOnHover: true,
                                            onBeforePaste: (
                                                pastedValue,
                                                opts
                                            ) => pastedValue.slice(-10),
                                        }
                                    )}
                                    errorMessage={
                                        errors.secretFields?.phoneNumber
                                            ?.message as string
                                    }
                                    label="Контактный номер телефона подающего лица"
                                />
                                <TextField
                                    type="text"
                                    {...register(`secretFields.email`)}
                                    errorMessage={
                                        errors.secretFields?.email
                                            ?.message as string
                                    }
                                    label="Электронная почта подающего лица"
                                    placeholder="Введите адрес электронной почты"
                                />
                            </>
                        )}
                        {user?.type === "person" && !user.isAdmin && (
                            <>
                                <TextField
                                    type="text"
                                    {...register(`fio`)}
                                    errorMessage={errors.fio?.message as string}
                                    label="ФИО*"
                                    placeholder="Введите ФИО"
                                />
                                <TextField
                                    type="text"
                                    {...register(`address`)}
                                    errorMessage={
                                        errors.address?.message as string
                                    }
                                    label="Адрес регистрации"
                                    placeholder="Введите адрес регистрации"
                                />
                            </>
                        )}
                        {user?.type === "company" && !user.isAdmin && (
                            <>
                                <TextField
                                    type="text"
                                    {...register(`companyName`)}
                                    errorMessage={
                                        errors.companyName?.message as string
                                    }
                                    label="Название организации*"
                                    placeholder="Введите название организации"
                                />
                                <TextField
                                    type="text"
                                    {...register(`companyAddress`)}
                                    errorMessage={
                                        errors.companyAddress?.message as string
                                    }
                                    label="Юридический адрес организации"
                                    placeholder="Введите юридический адрес организации"
                                />
                                <TextField
                                    type="text"
                                    {...register(`registrationNumber`)}
                                    errorMessage={
                                        errors.registrationNumber
                                            ?.message as string
                                    }
                                    label="ОГРН"
                                    placeholder="Введите ОГРН"
                                />
                                <TextField
                                    type="text"
                                    {...register(`paymentAccount`)}
                                    errorMessage={
                                        errors.paymentAccount?.message as string
                                    }
                                    label="Расчетный счет"
                                    placeholder="Введите расчетный счет"
                                />
                                <TextField
                                    type="text"
                                    {...register(`bank`)}
                                    errorMessage={
                                        errors.bank?.message as string
                                    }
                                    label="Банк"
                                    placeholder="Укажите банк"
                                />
                                <TextField
                                    type="text"
                                    {...register(`bankId`)}
                                    errorMessage={
                                        errors.bankId?.message as string
                                    }
                                    label="БИК банка"
                                    placeholder="Введите БИК банка"
                                />
                                <TextField
                                    type="text"
                                    {...register(`correspondentAccount`)}
                                    errorMessage={
                                        errors.correspondentAccount
                                            ?.message as string
                                    }
                                    label="К/счет банка"
                                    placeholder="Введите К/счет банка"
                                />
                            </>
                        )}
                        {!user?.isAdmin && user?.type !== "botOwner" && (
                            <>
                                <TextField
                                    type="text"
                                    {...withHookFormMask(register(`inn`), "", {
                                        regex: "[0-9]*",
                                        autoUnmask: true,
                                        placeholder: "",
                                        showMaskOnHover: false,
                                    })}
                                    errorMessage={errors.inn?.message as string}
                                    label="ИНН*"
                                    placeholder="Введите ИНН"
                                />
                                <TextField
                                    {...withHookFormMask(
                                        register(`phoneNumber`),
                                        "+7(999)999-99-99",
                                        {
                                            autoUnmask: true,
                                            placeholder: "_",
                                            showMaskOnHover: true,
                                            onBeforePaste: (
                                                pastedValue,
                                                opts
                                            ) => pastedValue.slice(-10),
                                        }
                                    )}
                                    placeholder="+7"
                                    errorMessage={
                                        errors.phoneNumber?.message as string
                                    }
                                    label="Номер телефона*"
                                />
                                <TextField
                                    type="email"
                                    {...register(`email`)}
                                    disabled
                                    errorMessage={
                                        errors.email?.message as string
                                    }
                                    label="Электронная почта"
                                    placeholder="Введите адрес электронной почты"
                                />
                                {agencyUser && (
                                    <TextField
                                        type="text"
                                        value={agencyUser.companyName}
                                        disabled
                                        label="Компания"
                                    />
                                )}
                                {user?.type === "company" && (
                                    <TextField
                                        type="text"
                                        {...register(`contact`)}
                                        errorMessage={
                                            errors.contact?.message as string
                                        }
                                        label="Контактное лицо*"
                                        placeholder="Укажите контактное лицо"
                                    />
                                )}
                            </>
                        )}
                        {user?.type === "botOwner" && (
                            <>
                                <TextField
                                    type="text"
                                    {...register(`fio`)}
                                    errorMessage={errors.fio?.message as string}
                                    label="ФИО*"
                                    placeholder="Введите ФИО"
                                />
                                <TextField
                                    {...withHookFormMask(
                                        register(`phoneNumber`),
                                        "+7(999)999-99-99",
                                        {
                                            autoUnmask: true,
                                            placeholder: "_",
                                            showMaskOnHover: true,
                                            onBeforePaste: (
                                                pastedValue,
                                                opts
                                            ) => pastedValue.slice(-10),
                                        }
                                    )}
                                    placeholder="+7"
                                    errorMessage={
                                        errors.phoneNumber?.message as string
                                    }
                                    label="Номер телефона*"
                                />
                                <TextField
                                    type="email"
                                    {...register(`email`)}
                                    disabled
                                    errorMessage={
                                        errors.email?.message as string
                                    }
                                    label="Электронная почта"
                                    placeholder="Введите адрес электронной почты"
                                />

                                <TextField
                                    type="text"
                                    {...register(`telegram`)}
                                    errorMessage={
                                        errors.telegram?.message as string
                                    }
                                    label="Телеграм*"
                                    placeholder="Укажите ник в телеграм"
                                />

                                <TextField
                                    type="text"
                                    {...register(`companyName`)}
                                    errorMessage={
                                        errors.companyName?.message as string
                                    }
                                    label="Название организации*"
                                    placeholder="Введите название организации"
                                />
                                <TextField
                                    type="text"
                                    {...register(`companyAddress`)}
                                    errorMessage={
                                        errors.companyAddress?.message as string
                                    }
                                    label="Юридический адрес организации"
                                    placeholder="Введите юридический адрес организации"
                                />

                                <TextField
                                    type="text"
                                    {...register(`registrationNumber`)}
                                    errorMessage={
                                        errors.registrationNumber
                                            ?.message as string
                                    }
                                    label="ОГРН"
                                    placeholder="Введите ОГРН"
                                />

                                <TextField
                                    type="text"
                                    {...withHookFormMask(register(`inn`), "", {
                                        regex: "[0-9]*",
                                        autoUnmask: true,
                                        placeholder: "",
                                        showMaskOnHover: false,
                                    })}
                                    errorMessage={errors.inn?.message as string}
                                    label="ИНН*"
                                    placeholder="Введите ИНН"
                                />

                                <TextField
                                    type="text"
                                    {...register(`paymentAccount`)}
                                    errorMessage={
                                        errors.paymentAccount?.message as string
                                    }
                                    label="Расчетный счет"
                                    placeholder="Введите расчетный счет"
                                />
                                <TextField
                                    type="text"
                                    {...register(`bank`)}
                                    errorMessage={
                                        errors.bank?.message as string
                                    }
                                    label="Банк"
                                    placeholder="Укажите банк"
                                />
                                <TextField
                                    type="text"
                                    {...register(`bankId`)}
                                    errorMessage={
                                        errors.bankId?.message as string
                                    }
                                    label="БИК банка"
                                    placeholder="Введите БИК банка"
                                />
                                <TextField
                                    type="text"
                                    {...register(`correspondentAccount`)}
                                    errorMessage={
                                        errors.correspondentAccount
                                            ?.message as string
                                    }
                                    label="К/счет банка"
                                    placeholder="Введите К/счет банка"
                                />
                            </>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={!isValid}
                        dense
                        title="Сохранить"
                    />
                    <div className="profile-form__hint">
                        * - обязательные поля
                    </div>
                </form>
            </WithLoading>
            <div className="profile-notifications">
                <h3 className="profile-notifications__title">
                    Настройка оповещений
                </h3>
                <div className="profile-notifications__fields-container">
                    <div className="profile-notifications__input">
                        <EditInput
                            value={user?.notificationEmail || ""}
                            label="Email:"
                            type="email"
                            onConfirm={(value) => {
                                onUpdateUserNotificationParams(
                                    "notificationEmail",
                                    value
                                );
                            }}
                        />
                        <Toggle
                            id="email-notifications"
                            icons={false}
                            className="notifications-toggle"
                            defaultChecked={user?.notificationEmailEnabled}
                            onChange={(e) => {
                                onUpdateUserNotificationParams(
                                    "notificationEmailEnabled",
                                    !user?.notificationEmailEnabled
                                );
                            }}
                        />
                    </div>
                    <div className="profile-notifications__input">
                        <EditInput
                            value={user?.notificationTelegram || ""}
                            label="Телеграм:"
                            onConfirm={(value) => {
                                onUpdateUserNotificationParams(
                                    "notificationTelegram",
                                    value
                                );
                            }}
                        />
                        <Toggle
                            id="telegram-notifications"
                            icons={false}
                            className="notifications-toggle"
                            defaultChecked={user?.notificationTelegramEnabled}
                            onChange={(e) => {
                                onUpdateUserNotificationParams(
                                    "notificationTelegramEnabled",
                                    !user?.notificationTelegramEnabled
                                );
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="profile-form__pwd-change-btn">
                <Button
                    title="Изменить пароль"
                    dense
                    onClick={() => setIsPasswordChangeModalOpen(true)}
                />
                <PasswordChangeModal
                    isOpen={isPasswordChangeModalOpen}
                    onClose={() => setIsPasswordChangeModalOpen(false)}
                />
            </div>

            {user?.type === "botOwner" && (
                <>
                    <h3 className="profile-form__subtitle">
                        Ваш доход в этом месяце мог составить
                    </h3>
                    <p className="profile-form__commission-percentage">
                        процент выплаты от стоимости каждой записи{" - "}
                        <span>{user.commissionPercentage}%</span>
                    </p>
                    <div className="table income-table">
                        <div className="table__inner">
                            <div className="table__header">
                                <div className="table__th">Страна</div>
                                <div className="table__th">
                                    Потенциальный доход
                                </div>
                                <div className="table__th">
                                    % успешных записей
                                </div>
                                <div className="table__th table__th--wrap">
                                    {`Успешно обработано за ${getCurrentMonthYear()}`}
                                </div>
                                <div className="table__th">Итого к выплате</div>
                                <div className="table__th">API ключ</div>
                            </div>
                            <div className="table__body">
                                {botOwnerStatistics.map((item) => (
                                    <div
                                        className="table__row"
                                        key={item.country.value}
                                    >
                                        <div className="table__td ellipsis-text">
                                            {item.country.label}
                                        </div>
                                        <div className="table__td">
                                            {item.estimatedIncome}
                                        </div>
                                        <div className="table__td">
                                            {item.successRecords &&
                                            item.totalRecords
                                                ? (
                                                      (item.successRecords /
                                                          item.totalRecords) *
                                                      100
                                                  ).toFixed(1)
                                                : "0"}
                                        </div>
                                        <div className="table__td">
                                            {item.successRecords}
                                        </div>
                                        <div className="table__td">
                                            {item.finalIncome}
                                        </div>
                                        <div className="table__td">
                                            {item.apiKey ? (
                                                item.apiKey
                                            ) : (
                                                <Button
                                                    className="profile-form__apikey-btn"
                                                    title="Сгенерировать"
                                                    dense
                                                    onClick={() =>
                                                        generateBot(
                                                            item.country.value
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="table__row">
                                    <div className="table__td price-table__colspan-3">
                                        Процент записи по всем странам:{" "}
                                        {totalPercent} %
                                    </div>
                                    <div className="table__td" />
                                    <div className="table__td">
                                        {totalIncome} ₽
                                    </div>
                                    <div className="table__td" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="suggestion-tg">
                        <p>
                            Есть предложение по новой стране или улучшению
                            сервиса? Или просто хотите задать вопрос по работе
                            сервиса?
                        </p>
                        <Button
                            title="Написать нам"
                            dense
                            className="suggestion-tg__btn"
                            onClick={() => {
                                window.open(
                                    "https://t.me/visabroker_official",
                                    "_blank"
                                );
                            }}
                        />
                    </div>
                </>
            )}

            {user?.isAdmin && (
                <>
                    <h3 className="profile-form__subtitle">
                        Управление ценами
                    </h3>
                    <div className="table price-table">
                        <div className="table__inner">
                            <div className="table__header">
                                <div className="table__th">Страна</div>
                                <div className="table__th">
                                    Стандарт (Столица)
                                </div>
                                <div className="table__th">
                                    Стандарт (Регионы)
                                </div>
                                <div className="table__th">VIP (Столица)</div>
                                <div className="table__th">VIP (Регионы)</div>
                            </div>
                            <div className="table__body">
                                {prices.map((item) => (
                                    <div
                                        className="table__row"
                                        key={item.value}
                                    >
                                        <div className="table__td ellipsis-text">
                                            {item.label}
                                        </div>
                                        <div className="table__td">
                                            {editPriceMode ? (
                                                <input
                                                    className="price-table__input"
                                                    type="number"
                                                    value={
                                                        item.priceStandardCapital
                                                    }
                                                    onChange={(e) =>
                                                        onUpdatePrice(
                                                            item.value,
                                                            "priceStandardCapital",
                                                            +e.target.value
                                                        )
                                                    }
                                                />
                                            ) : (
                                                item.priceStandardCapital
                                            )}
                                        </div>
                                        <div className="table__td">
                                            {editPriceMode ? (
                                                <input
                                                    className="price-table__input"
                                                    type="number"
                                                    value={
                                                        item.priceStandardRegion
                                                    }
                                                    onChange={(e) =>
                                                        onUpdatePrice(
                                                            item.value,
                                                            "priceStandardRegion",
                                                            +e.target.value
                                                        )
                                                    }
                                                />
                                            ) : (
                                                item.priceStandardRegion
                                            )}
                                        </div>
                                        <div className="table__td">
                                            {editPriceMode ? (
                                                <input
                                                    className="price-table__input"
                                                    type="number"
                                                    value={item.priceVipCapital}
                                                    onChange={(e) =>
                                                        onUpdatePrice(
                                                            item.value,
                                                            "priceVipCapital",
                                                            +e.target.value
                                                        )
                                                    }
                                                />
                                            ) : (
                                                item.priceVipCapital
                                            )}
                                        </div>
                                        <div className="table__td">
                                            {editPriceMode ? (
                                                <input
                                                    className="price-table__input"
                                                    type="number"
                                                    value={item.priceVipRegion}
                                                    onChange={(e) =>
                                                        onUpdatePrice(
                                                            item.value,
                                                            "priceVipRegion",
                                                            +e.target.value
                                                        )
                                                    }
                                                />
                                            ) : (
                                                item.priceVipRegion
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="price-edit-btns">
                        <Button
                            title="Редактировать"
                            dense
                            onClick={() => setEditPriceMode((prev) => !prev)}
                        />
                        <Button
                            title="Сохранить"
                            dense
                            disabled={!editPriceMode}
                            onClick={onPriceSave}
                        />
                    </div>
                </>
            )}

            {user?.type !== "botOwner" && !user?.isAdmin && userPrices && (
                <>
                    <h3 className="profile-form__subtitle">Цены</h3>
                    <div className="table price-table price-table--user">
                        <div className="table__inner">
                            <div className="table__header">
                                <div className="table__th">Страна</div>
                                <div className="table__th">Столица</div>
                                <div className="table__th">Регионы</div>
                            </div>
                            <div className="table__body">
                                {userPrices.map((item, index) => (
                                    <div
                                        className="table__row"
                                        key={item.value}
                                    >
                                        <div className="table__td ellipsis-text">
                                            {item.label}
                                        </div>
                                        <div className="table__td">
                                            {item.priceStandardCapital}
                                        </div>
                                        <div className="table__td">
                                            {item.priceStandardRegion}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
