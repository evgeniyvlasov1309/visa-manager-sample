import chinaFlag from "@assets/icons/china.svg";
import profileIcon from "@assets/icons/profile.svg";
import type { User, UserRequest } from "@pages/auth/auth-types";
import { useRecordsStore } from "@pages/home/store";
import { useUsersStore } from "@pages/users/store";
import type { Price } from "@pages/users/types";
import UserService from "@pages/users/user-service";
import CountryChip from "@shared/components/filters/CountryFilter/components/CountryChip/CountryChip";
import { Button } from "@shared/components/ui/Button/Button";
import { TextField } from "@shared/components/ui/TextField/TextField";
import WithLoading from "@shared/components/utility/WithLoading/WIthLoading";
import { getCurrentMonthYear } from "@shared/utilities/getCurrentMonthYear";
import withHookFormMask from "@shared/utilities/validation/withHookFormMask";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import "./user.scss";

export default function UserPage() {
    const { id: userId = "" } = useParams();
    const [loading, setLoading] = useState(false);
    const [user, getUser, updateUser] = useUsersStore((state) => [
        state.current,
        state.getUser,
        state.updateUser,
    ]);

    const [agencyUser, setAgencyUser] = useState<Nullable<User>>(null);

    useEffect(() => {
        if (user?.agencyId) {
            UserService.getUser(user.agencyId.toString()).then((u) =>
                setAgencyUser(u)
            );
        }
        return () => {
            setAgencyUser(null);
        };
    }, [user]);

    const [
        initialPrices,
        fetchPrices,
        botOwnerStatistics,
        fetchBotOwnerStatistics,
    ] = useRecordsStore((state) => [
        state.prices,
        state.fetchPrices,
        state.botOwnerStatistics,
        state.fetchBotOwnerStatistics,
    ]);

    useEffect(() => {
        getUser(userId);
    }, [userId]);

    const [prices, setPrices] = useState(initialPrices);

    useEffect(() => {
        if (!initialPrices.length) {
            fetchPrices();
        }
        setPrices(initialPrices);
    }, [initialPrices]);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { isValid, errors },
    } = useForm<UserRequest>({
        defaultValues: {
            ...user,
        } as User,
    });

    useEffect(() => {
        reset({ ...user });
        if (user?.type === "botOwner") {
            fetchBotOwnerStatistics(+userId);
        }
    }, [user]);

    const avatarImage = watch("avatar");

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

    const [userPrices, setUserPrices] = useState<Price[]>([]);
    const [editPriceMode, setEditPriceMode] = useState(false);

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

    function onPriceSave() {
        if (!editPriceMode) return;
        if (!user) return;
        updateUser(+userId, { ...user, prices: JSON.stringify(userPrices) });
        setEditPriceMode(false);
    }

    function onUpdatePrice(country: string, field: string, newValue: number) {
        const newPrices = userPrices.slice();
        const target = newPrices.find((price) => price.value === country);
        if (!target) return;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        target[field] = newValue;

        setUserPrices(newPrices);
    }

    async function onSubmit(data: UserRequest) {
        setLoading(true);
        try {
            if (!user) return;
            await UserService.updateUser(user.id, data);
            await getUser(userId);
            setLoading(false);
        } catch (error) {
            alert(error);
            setLoading(false);
        }
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
                        <img
                            className="profile-form__avatar-image"
                            src={avatarImage || profileIcon}
                            width="100px"
                            height="100px"
                            alt="avatar"
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
                                    disabled
                                />
                                <TextField
                                    type="text"
                                    {...register(`address`)}
                                    errorMessage={
                                        errors.address?.message as string
                                    }
                                    label="Адрес регистрации"
                                    placeholder="Введите адрес регистрации"
                                    disabled
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
                                    disabled
                                />
                                <TextField
                                    type="text"
                                    {...register(`companyAddress`)}
                                    errorMessage={
                                        errors.companyAddress?.message as string
                                    }
                                    label="Юридический адрес организации"
                                    placeholder="Введите юридический адрес организации"
                                    disabled
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
                                    disabled
                                />
                                <TextField
                                    type="text"
                                    {...register(`paymentAccount`)}
                                    errorMessage={
                                        errors.paymentAccount?.message as string
                                    }
                                    label="Расчетный счет"
                                    placeholder="Введите расчетный счет"
                                    disabled
                                />
                                <TextField
                                    type="text"
                                    {...register(`bank`)}
                                    errorMessage={
                                        errors.bank?.message as string
                                    }
                                    label="Банк"
                                    placeholder="Укажите банк"
                                    disabled
                                />
                                <TextField
                                    type="text"
                                    {...register(`bankId`)}
                                    errorMessage={
                                        errors.bankId?.message as string
                                    }
                                    label="БИК банка"
                                    placeholder="Введите БИК банка"
                                    disabled
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
                                    disabled
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
                                    disabled
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
                                    disabled
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
                                        disabled
                                    />
                                )}
                            </>
                        )}
                        {user?.type !== "botOwner" && (
                            <>
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
                        {user?.type === "botOwner" && (
                            <>
                                <TextField
                                    type="text"
                                    {...register(`fio`)}
                                    errorMessage={errors.fio?.message as string}
                                    label="ФИО*"
                                    placeholder="Введите ФИО"
                                    disabled
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
                                    disabled
                                />

                                <TextField
                                    type="email"
                                    {...register(`email`)}
                                    errorMessage={
                                        errors.email?.message as string
                                    }
                                    label="Электронная почта"
                                    placeholder="Введите адрес электронной почты"
                                    disabled
                                />

                                <TextField
                                    type="text"
                                    {...register(`telegram`)}
                                    errorMessage={
                                        errors.telegram?.message as string
                                    }
                                    label="Телеграм*"
                                    placeholder="Укажите ник в телеграм"
                                    disabled
                                />

                                <TextField
                                    type="text"
                                    {...register(`companyName`)}
                                    errorMessage={
                                        errors.companyName?.message as string
                                    }
                                    label="Название организации*"
                                    placeholder="Введите название организации"
                                    disabled
                                />

                                <TextField
                                    type="text"
                                    {...register(`companyAddress`)}
                                    errorMessage={
                                        errors.companyAddress?.message as string
                                    }
                                    label="Юридический адрес организации"
                                    placeholder="Введите юридический адрес организации"
                                    disabled
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
                                    disabled
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
                                    disabled
                                />

                                <TextField
                                    type="text"
                                    {...register(`paymentAccount`)}
                                    errorMessage={
                                        errors.paymentAccount?.message as string
                                    }
                                    label="Расчетный счет"
                                    placeholder="Введите расчетный счет"
                                    disabled
                                />

                                <TextField
                                    type="text"
                                    {...register(`bank`)}
                                    errorMessage={
                                        errors.bank?.message as string
                                    }
                                    label="Банк"
                                    placeholder="Укажите банк"
                                    disabled
                                />

                                <TextField
                                    type="text"
                                    {...register(`bankId`)}
                                    errorMessage={
                                        errors.bankId?.message as string
                                    }
                                    label="БИК банка"
                                    placeholder="Введите БИК банка"
                                    disabled
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
                                    disabled
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
                </form>
            </WithLoading>
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
                                            {item.apiKey ? item.apiKey : "-"}
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
                </>
            )}
            {user?.type !== "botOwner" &&
                userPrices.length &&
                prices.length && (
                    <>
                        <h3 className="profile-form__subtitle">
                            Управление ценами
                        </h3>
                        <div className="table price-table price-table--user">
                            <div className="table__inner">
                                <div className="table__header">
                                    <div className="table__th">Страна</div>
                                    <div className="table__th">Столица</div>
                                    <div className="table__th">Регионы</div>
                                </div>
                                <div className="table__body">
                                    {userPrices.map((item) => (
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
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {!agencyUser && (
                            <div className="price-edit-btns">
                                <Button
                                    title="Редактировать"
                                    dense
                                    onClick={() =>
                                        setEditPriceMode((prev) => !prev)
                                    }
                                />
                                <Button
                                    title="Сохранить"
                                    dense
                                    disabled={!editPriceMode}
                                    onClick={onPriceSave}
                                />
                            </div>
                        )}
                    </>
                )}
        </>
    );
}
