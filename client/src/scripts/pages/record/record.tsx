import addIcon from "@assets/icons/plus.svg";
import questionIcon from "@assets/icons/question-mark.svg";
import removeIcon from "@assets/icons/remove.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthStore } from "@pages/auth/store";
import { useRecordsStore } from "@pages/home/store";
import CountryFilter from "@shared/components/filters/CountryFilter/CountryFilter";
import { useCountryFilterStore } from "@shared/components/filters/CountryFilter/store";
import { Button } from "@shared/components/ui/Button/Button";
import Card from "@shared/components/ui/Card/Card";
import { Checkbox } from "@shared/components/ui/Checkbox/Checkbox";
import { Select } from "@shared/components/ui/Select/Select";
import { TextField } from "@shared/components/ui/TextField/TextField";
import { TextArea } from "@shared/components/ui/Textarea/Textarea";
import WithLoading from "@shared/components/utility/WithLoading/WIthLoading";
import withHookFormMask from "@shared/utilities/validation/withHookFormMask";
import {
    chinaRecordSchema,
    recordSchema,
    usaRecordSchema,
} from "@shared/utilities/validation/yap";
import { format } from "date-fns";
import ru from "date-fns/locale/ru";
import React, { useEffect, useMemo, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Toggle from "react-toggle";
import { Tooltip } from "react-tooltip";
import {
    chinaDefaultValues,
    chinaFields,
    citizenshipOptions,
    cityOptions,
    franceDefaultValues,
    franceFields,
    genderOptions,
    passportTypeOptions,
    recordCategoryOptions,
    recordFromLabel,
    recordingDateOffsetLabel,
    residenceCountryOptions,
    spainDefaultValues,
    spainFields,
    statusOptions,
    usaDefaultValues,
    usaFields,
    visaCategoryOptions,
    visaCenterOptions,
    visaSpbCategoryOptions,
    visaSubcategoryOptionsLong,
    visaSubcategoryOptionsShort,
} from "./formOptions";
import RecordService from "./record-service";
import "./record.scss";
import type { Applicant, Record, RecordRequest } from "./record.types";

registerLocale("ru", ru);

export default function RecordPage() {
    const { id: recordId = "" } = useParams();
    const [validationSchema, setValidationSchema] = useState<any>(recordSchema);
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<Record>({} as Record);
    const [loading, setLoading] = useState(false);
    const [user] = useAuthStore((state) => [state.user]);
    const [isIndividualRecords, setIsIndividualRecords] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        control,
        watch,
        formState: { isValid, isDirty, errors },
    } = useForm<RecordRequest>({
        defaultValues: {
            ...franceDefaultValues,
            ...user?.permanentFields,
            applicants: [
                {
                    ...franceDefaultValues.applicants[0],
                },
            ],
        },
        resolver: yupResolver(validationSchema),
    });

    const watchedCountry = watch("destinationCountry");
    const enableRecordingDateFrom = watch("enableRecordingDateFrom");
    const enableRecordingDateTo = watch("enableRecordingDateTo");
    const enableRecordingDateOffset = watch("enableRecordingDateOffset");
    const visaCategory = watch("visaCategory");
    const postPayment = watch("postPayment");
    const payment = watch("payment");
    const visaCenter = watch("visaCenter");
    const polandSelected = visaCenter === "Польша";
    const kzSelected = visaCenter === "Казахстан";
    const recordStatus = watch("status");

    const readOnlyMode = recordStatus === "success";

    const resident = useMemo(
        () => polandSelected || kzSelected,
        [polandSelected, kzSelected]
    );

    const watchedCity = watch("city");

    useEffect(() => {
        if (resident) {
            setValue("postPayment", false);
        } else {
            setValue("postPayment", initialValues.postPayment);
        }
    }, [resident]);

    useEffect(() => {
        const { applicants } = getValues();
        if (watchedCountry !== "Ch") return;
        if (watchedCity === "Москва" || watchedCity === "Санкт-Петербург") {
            setValue("type", "visacenter");
        } else {
            setValue("type", "embassy");
        }
        const cityCode =
            watchedCity === "Москва"
                ? "MOW"
                : watchedCity === "Санкт-Петербург"
                ? "LED"
                : "";

        setValue(
            "applicants",
            applicants.map((a) => ({
                ...a,
                applicationNumber: `${cityCode}${a.applicationNumber.replace(
                    /MOW|LED/g,
                    ""
                )}`,
            }))
        );
    }, [watchedCity]);

    useEffect(() => {
        if (!user?.phoneNumber) {
            alert("Перед созданием записи заполните пожалуйста профиль");
            navigate("/profile");
        }
    }, []);

    useEffect(() => {
        if (enableRecordingDateFrom) return;
        setValue("recordingDateFrom", null);
    }, [enableRecordingDateFrom]);

    useEffect(() => {
        if (enableRecordingDateTo) return;
        setValue("recordingDateTo", null);
    }, [enableRecordingDateTo]);

    useEffect(() => {
        if (enableRecordingDateOffset) return;
        setValue("recordingDateOffset", "");
    }, [enableRecordingDateOffset]);

    const [deleteItem, setCurrent] = useRecordsStore((state) => [
        state.deleteItem,
        state.setCurrent,
    ]);

    const [currentCountry, setCountry] = useCountryFilterStore((state) => [
        state.country,
        state.setCountry,
    ]);

    useEffect(() => {
        setValue("destinationCountry", currentCountry);
    }, [currentCountry]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "applicants",
    });

    const [activeFields, setActiveFields] = useState<string[]>([]);

    useEffect(() => {
        switch (currentCountry || watchedCountry) {
            case "Fr":
                setValidationSchema(recordSchema);
                setActiveFields(franceFields);
                if (!recordId) {
                    reset({
                        ...franceDefaultValues,
                    });
                }
                break;
            case "Sp":
                setValidationSchema(recordSchema);
                setActiveFields(spainFields);
                if (!recordId) {
                    reset({
                        ...spainDefaultValues,
                    });
                }
                break;
            case "Ch":
                setValidationSchema(chinaRecordSchema);
                setActiveFields(chinaFields);
                if (!recordId) {
                    reset({
                        ...chinaDefaultValues,
                        ...user?.permanentFields,
                        applicants: [
                            {
                                ...chinaDefaultValues.applicants[0],
                            },
                        ],
                    });
                }
                break;
            case "Usa":
                setValidationSchema(usaRecordSchema);
                setActiveFields(usaFields);
                if (!recordId) {
                    reset({
                        ...usaDefaultValues,
                    });
                }
                break;
        }

        if (watchedCountry === initialValues.destinationCountry) {
            reset(initialValues);
        }

        if (currentCountry) {
            setValue("destinationCountry", currentCountry);
            setCountry(currentCountry);
        } else {
            setCountry(watchedCountry);
        }
    }, [watchedCountry]);

    useEffect(() => {
        if (!recordId) return;
        setLoading(true);
        RecordService.getRecord(parseInt(recordId))
            .then((record) => {
                setInitialValues(record);
                setCurrent(record);
                setCountry(record.destinationCountry);
                reset(record);
            })
            .catch(() => {
                navigate("/");
            })
            .finally(() => setLoading(false));

        return () => {
            setCurrent(null);
        };
    }, []);

    function getSelectedValue(field: string) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const value = watch(field) as string;
        return value ? new Date(value) : null;
    }

    const MAX_APPLICANTS =
        watchedCity === "Москва" || watchedCity === "Санкт-Петербург" ? 4 : 6;

    const applicants = getValues().applicants;
    const addApplicantDisabled =
        !isIndividualRecords && applicants.length > MAX_APPLICANTS;

    function appendApplicantHandler() {
        if (readOnlyMode) return;
        if (addApplicantDisabled) {
            alert(
                `Вы можете добавить не более ${MAX_APPLICANTS} заявителей в одну запись`
            );
            return;
        }

        if (currentCountry === "Ch") {
            append({
                citizenship: "179",
            } as Applicant);
        } else {
            append({
                citizenship: "179",
            } as Applicant);
        }
    }

    function removeApplicantHandler(index: number) {
        remove(index);
    }

    function deleteRecord(id: number) {
        // eslint-disable-next-line no-restricted-globals
        const shouldRemove = confirm("Удалить запись?");
        if (shouldRemove) {
            deleteItem(id);
            navigate("/");
        }
    }

    function getOptions(options: any) {
        switch (watchedCountry) {
            case "Fr":
                return options["Fr"];
            case "Sp":
                return options["Sp"];
            case "Ch":
                return options["Ch"];
            case "Usa":
                return options["Usa"];
        }
    }

    async function onSubmit(data: RecordRequest) {
        setLoading(true);
        if (!isDirty) {
            navigate("/");
            return;
        }
        try {
            if (recordId) {
                await RecordService.editRecord(+recordId, data);
            } else {
                if (isIndividualRecords) {
                    await Promise.all(
                        data.applicants.map((appl) => {
                            if (appl.submittingPerson) {
                                return RecordService.createRecord({
                                    ...data,
                                    firstName: appl.firstName,
                                    surname: appl.surname,
                                    enableRecordingDateFrom:
                                        appl.enableRecordingDateFrom,
                                    enableRecordingDateTo:
                                        appl.enableRecordingDateTo,
                                    recordingDateFrom: appl.recordingDateFrom,
                                    recordingDateTo: appl.recordingDateTo,
                                    ignoreSecretFields: true,
                                    applicants: [appl],
                                });
                            } else {
                                return RecordService.createRecord({
                                    ...data,
                                    applicants: [appl],
                                });
                            }
                        })
                    );
                } else {
                    if (applicants.length > MAX_APPLICANTS) {
                        alert(
                            `Вы можете добавить не более ${MAX_APPLICANTS} заявителей в одну запись`
                        );
                        return;
                    }
                    await RecordService.createRecord(data);
                }
            }
            navigate("/");
        } catch (error) {
            alert(error);
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="h1">Записаться на подачу документов </h1>
            <WithLoading loading={loading}>
                <form className="record-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="record-form__country-filter">
                        <CountryFilter allowAll={false} />
                        {recordId && (
                            <Button
                                dense
                                title="Удалить"
                                variant="secondary"
                                onClick={() => deleteRecord(+recordId)}
                            />
                        )}
                        {!recordId && (
                            <div className="individual-records-toggle">
                                <Toggle
                                    id="individual-records"
                                    icons={false}
                                    defaultChecked={isIndividualRecords}
                                    onChange={(e) => {
                                        setIsIndividualRecords((prev) => !prev);
                                    }}
                                />
                                <label
                                    className="individual-records-label"
                                    htmlFor="individual-records"
                                >
                                    Занести всех Заявителей, как одиночных
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="record-form__section">
                        <Card>
                            <div className="record-form__common">
                                <div className="record-form__subtitle">
                                    Информация о подаче документов
                                </div>
                                <div className="record-form__common-fields-top">
                                    {/* <Select
                                        items={countries}
                                        autoFocus={true}
                                        hidden={
                                            !activeFields.includes(
                                                "destinationCountry"
                                            )
                                        }
                                        {...register("destinationCountry")}
                                        disabled={readOnlyMode}
                                        errorMessage={
                                            errors.destinationCountry
                                                ?.message as string
                                        }
                                        label="Страна посещения*"
                                        placeholder="Выберите страну"
                                        onInput={(e: any) => {
                                            setCountry(e.target.value);
                                        }}
                                    /> */}
                                    <Select
                                        items={residenceCountryOptions}
                                        {...register("residenceCountry")}
                                        hidden={
                                            !activeFields.includes(
                                                "residenceCountry"
                                            )
                                        }
                                        disabled={readOnlyMode}
                                        errorMessage={
                                            errors.residenceCountry
                                                ?.message as string
                                        }
                                        label="Страна проживания*"
                                        placeholder="Выберите страну"
                                    />
                                    <Select
                                        items={cityOptions}
                                        {...register("city")}
                                        hidden={!activeFields.includes("city")}
                                        errorMessage={
                                            errors.city?.message as string
                                        }
                                        disabled={readOnlyMode}
                                        label="Город*"
                                        placeholder="Выберите город"
                                    />
                                    <Select
                                        items={getOptions(visaCenterOptions)}
                                        {...register("visaCenter")}
                                        hidden={
                                            !activeFields.includes("visaCenter")
                                        }
                                        errorMessage={
                                            errors.visaCenter?.message as string
                                        }
                                        disabled={readOnlyMode}
                                        label="Визовый центр*"
                                        placeholder="Выберите страну, город или центр"
                                    />
                                    {polandSelected &&
                                        watchedCountry === "Usa" && (
                                            <div className="city-checkboxes">
                                                <Checkbox
                                                    label="Краков"
                                                    id={`cities1`}
                                                    value="Краков"
                                                    disabled={readOnlyMode}
                                                    {...register(`cities`)}
                                                />
                                                <Checkbox
                                                    label="Варшава"
                                                    id={`cities2`}
                                                    value="Варшава"
                                                    disabled={readOnlyMode}
                                                    {...register(`cities`)}
                                                />
                                            </div>
                                        )}
                                    {kzSelected && watchedCountry === "Usa" && (
                                        <div className="city-checkboxes">
                                            <Checkbox
                                                label="Астана"
                                                id={`cities1`}
                                                value="Астана"
                                                disabled={readOnlyMode}
                                                {...register(`cities`)}
                                            />
                                            <Checkbox
                                                label="Алматы"
                                                id={`cities2`}
                                                value="Алматы"
                                                disabled={readOnlyMode}
                                                {...register(`cities`)}
                                            />
                                        </div>
                                    )}
                                    <Select
                                        items={getOptions(
                                            recordCategoryOptions
                                        )}
                                        {...register("recordCategory")}
                                        hidden={
                                            !activeFields.includes(
                                                "recordCategory"
                                            )
                                        }
                                        errorMessage={
                                            errors.recordCategory
                                                ?.message as string
                                        }
                                        disabled={readOnlyMode}
                                        label="Категория записи*"
                                        placeholder="Выберите категорию визы"
                                    />
                                    <Select
                                        items={getOptions(
                                            watch("visaCenter") ===
                                                "Санкт-Петербург"
                                                ? visaSpbCategoryOptions
                                                : visaCategoryOptions
                                        )}
                                        {...register("visaCategory")}
                                        hidden={
                                            !activeFields.includes(
                                                "visaCategory"
                                            )
                                        }
                                        errorMessage={
                                            errors.visaCategory
                                                ?.message as string
                                        }
                                        disabled={readOnlyMode}
                                        label="Тип визы*"
                                        placeholder="Выберите категорию визы"
                                    />
                                    <Select
                                        items={getOptions(
                                            visaCategory === "1273"
                                                ? visaSubcategoryOptionsShort
                                                : visaSubcategoryOptionsLong
                                        )}
                                        {...register("visaSubcategory")}
                                        hidden={
                                            !activeFields.includes(
                                                "visaSubcategory"
                                            )
                                        }
                                        disabled={readOnlyMode}
                                        errorMessage={
                                            errors.visaSubcategory
                                                ?.message as string
                                        }
                                        label="Подкатегория визы*"
                                        placeholder="Выберите подвижную категорию визы"
                                    />
                                    <TextField
                                        {...withHookFormMask(
                                            register(`surname`),
                                            "",
                                            {
                                                regex: "[A-Za-z]*",
                                                showMaskOnHover: false,
                                                autoUnmask: true,
                                                onUnMask: (value) =>
                                                    value.toUpperCase(),
                                            }
                                        )}
                                        disabled={readOnlyMode}
                                        uppercase
                                        hidden={
                                            !activeFields.includes(
                                                "recordSurname"
                                            )
                                        }
                                        errorMessage={
                                            errors.surname?.message as string
                                        }
                                        style={{ gridColumn: "1/2" }}
                                        label="Фамилия подающего лица (латиницей)*"
                                        placeholder="Введите фамилию"
                                    />
                                    <TextField
                                        {...withHookFormMask(
                                            register(`firstName`),
                                            "",
                                            {
                                                regex: "[A-Za-z]*",
                                                showMaskOnHover: false,
                                                autoUnmask: true,
                                                onUnMask: (value) =>
                                                    value.toUpperCase(),
                                            }
                                        )}
                                        disabled={readOnlyMode}
                                        uppercase
                                        hidden={
                                            !activeFields.includes(
                                                "recordFirstName"
                                            )
                                        }
                                        errorMessage={
                                            errors.firstName?.message as string
                                        }
                                        label="Имя подающего лица (латиницей)*"
                                        placeholder="Введите имя"
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
                                        disabled={readOnlyMode}
                                        placeholder="+7"
                                        hidden={
                                            !activeFields.includes(
                                                "recordPhoneNumber"
                                            )
                                        }
                                        errorMessage={
                                            errors.phoneNumber
                                                ?.message as string
                                        }
                                        label="Контактный номер телефона подающего лица*"
                                    />
                                    <TextField
                                        type="email"
                                        {...register(`email`)}
                                        hidden={!activeFields.includes("email")}
                                        errorMessage={
                                            errors.email?.message as string
                                        }
                                        disabled={readOnlyMode}
                                        label="Электронная почта подающего лица*"
                                        placeholder="Введите адрес электронной почты"
                                    />
                                    <TextField
                                        type="number"
                                        {...register(`recordingDateOffset`)}
                                        hidden={
                                            !activeFields.includes(
                                                "recordingDateOffset"
                                            )
                                        }
                                        disabled={
                                            !watch(`enableRecordingDateOffset`)
                                        }
                                        errorMessage={
                                            errors.recordingDateOffset
                                                ?.message as string
                                        }
                                        labelRenderer={() => (
                                            <>
                                                <div className="text-field__label">
                                                    <Tooltip
                                                        id="my-tooltip"
                                                        style={{
                                                            width: "400px",
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                    <a
                                                        className="tooltip-link"
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content={
                                                            recordingDateOffsetLabel[
                                                                watchedCountry
                                                            ]
                                                        }
                                                    >
                                                        <Checkbox
                                                            label="Кол-во дней до записи"
                                                            id={`enableRecordingDateOffset`}
                                                            {...register(
                                                                `enableRecordingDateOffset`
                                                            )}
                                                        />
                                                        <img
                                                            src={questionIcon}
                                                            width="24"
                                                            height="24"
                                                            alt="question"
                                                        />
                                                    </a>
                                                </div>
                                            </>
                                        )}
                                    />
                                    <TextField
                                        type="date"
                                        {...register(`recordingDateFrom`)}
                                        hidden={
                                            !activeFields.includes(
                                                "recordingDateFrom"
                                            )
                                        }
                                        errorMessage={
                                            errors.recordingDateFrom
                                                ?.message as string
                                        }
                                        disabled={readOnlyMode}
                                        labelRenderer={() => (
                                            <>
                                                <div className="text-field__label">
                                                    <Tooltip
                                                        id="my-tooltip"
                                                        style={{
                                                            width: "400px",
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                    <a
                                                        className="tooltip-link"
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content={
                                                            recordFromLabel[
                                                                watchedCountry
                                                            ]
                                                        }
                                                    >
                                                        <Checkbox
                                                            label="Запись от"
                                                            id={`enableRecordingDateFrom`}
                                                            {...register(
                                                                `enableRecordingDateFrom`
                                                            )}
                                                        />
                                                        <img
                                                            src={questionIcon}
                                                            width="24"
                                                            height="24"
                                                            alt="question"
                                                        />
                                                    </a>
                                                </div>
                                            </>
                                        )}
                                        inputRenderer={() => (
                                            <DatePicker
                                                selected={getSelectedValue(
                                                    "recordingDateFrom"
                                                )}
                                                className="text-field__input"
                                                {...register(
                                                    `recordingDateFrom`
                                                )}
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                disabled={
                                                    !watch(
                                                        `enableRecordingDateFrom`
                                                    ) || readOnlyMode
                                                }
                                                onChange={(date) => {
                                                    setValue(
                                                        `recordingDateFrom`,
                                                        date
                                                            ? format(
                                                                  date,
                                                                  "yyyy-MM-dd"
                                                              )
                                                            : null,
                                                        { shouldDirty: true }
                                                    );
                                                }}
                                                selectsStart
                                                locale="ru"
                                                dateFormat={[
                                                    "dd/MM/yyyy",
                                                    "ddMMyyyy",
                                                    "dd.MM.yyyy",
                                                ]}
                                                placeholderText="дд/мм/гггг"
                                            />
                                        )}
                                    />
                                    <TextField
                                        type="date"
                                        {...register(`recordingDateTo`)}
                                        hidden={
                                            !activeFields.includes(
                                                "recordingDateTo"
                                            )
                                        }
                                        disabled={readOnlyMode}
                                        errorMessage={
                                            errors.recordingDateTo
                                                ?.message as string
                                        }
                                        labelRenderer={() => (
                                            <div className="text-field__label">
                                                <Checkbox
                                                    id={`enableRecordingDateTo`}
                                                    label="Запись до"
                                                    {...register(
                                                        `enableRecordingDateTo`
                                                    )}
                                                />
                                            </div>
                                        )}
                                        inputRenderer={() => (
                                            <DatePicker
                                                selected={getSelectedValue(
                                                    "recordingDateTo"
                                                )}
                                                className="text-field__input"
                                                {...register(`recordingDateTo`)}
                                                disabled={
                                                    !watch(
                                                        `enableRecordingDateTo`
                                                    ) || readOnlyMode
                                                }
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                onChange={(date) => {
                                                    setValue(
                                                        `recordingDateTo`,
                                                        date
                                                            ? format(
                                                                  date,
                                                                  "yyyy-MM-dd"
                                                              )
                                                            : null,
                                                        { shouldDirty: true }
                                                    );
                                                }}
                                                selectsEnd
                                                startDate={getSelectedValue(
                                                    "recordingDateFrom"
                                                )}
                                                endDate={getSelectedValue(
                                                    "recordingDateTo"
                                                )}
                                                locale="ru"
                                                dateFormat={[
                                                    "dd/MM/yyyy",
                                                    "ddMMyyyy",
                                                    "dd.MM.yyyy",
                                                ]}
                                                placeholderText="дд/мм/гггг"
                                            />
                                        )}
                                    />
                                    {user?.isAdmin && (
                                        <TextField
                                            type="email"
                                            {...register(`agent`)}
                                            hidden={
                                                !activeFields.includes("agent")
                                            }
                                            disabled
                                            errorMessage={
                                                errors.agent?.message as string
                                            }
                                            label="Агент"
                                            placeholder="Введите адрес электронной почты"
                                        />
                                    )}

                                    {resident && (
                                        <>
                                            <TextField
                                                {...register(`login`)}
                                                uppercase
                                                style={{ gridColumn: "1/2" }}
                                                hidden={
                                                    !activeFields.includes(
                                                        "login"
                                                    )
                                                }
                                                disabled={readOnlyMode}
                                                errorMessage={
                                                    errors.login
                                                        ?.message as string
                                                }
                                                label="Логин на сайте посольства"
                                                placeholder="Введите логин"
                                            />
                                            <TextField
                                                {...register(`password`)}
                                                uppercase
                                                hidden={
                                                    !activeFields.includes(
                                                        "password"
                                                    )
                                                }
                                                disabled={readOnlyMode}
                                                errorMessage={
                                                    errors.password
                                                        ?.message as string
                                                }
                                                label="Пароль  на сайте посольства"
                                                placeholder="Введите пароль"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="record-form__section">
                        <Card>
                            <div className="record-form__common">
                                <div className="record-form__subtitle">
                                    Дополнительная информация
                                </div>
                                <div className="record-form__common-fields-top">
                                    {user?.isAdmin && (
                                        <>
                                            {" "}
                                            <Select
                                                items={statusOptions}
                                                {...register("status")}
                                                style={{ gridColumn: "1 / 2" }}
                                                errorMessage={
                                                    errors.status
                                                        ?.message as string
                                                }
                                                label="Статус записи"
                                                placeholder="Выберите статус записи"
                                            />
                                            <Checkbox
                                                disabled={postPayment}
                                                label="Оплачен"
                                                id={`payment`}
                                                style={{ alignSelf: "center" }}
                                                {...register(`payment`)}
                                            />
                                            <Checkbox
                                                disabled={payment}
                                                label="Постоплата"
                                                id={`postPayment`}
                                                style={{ alignSelf: "center" }}
                                                {...register(`postPayment`)}
                                            />
                                        </>
                                    )}
                                    <TextArea
                                        {...register(`comment`)}
                                        hidden={
                                            !activeFields.includes("comment")
                                        }
                                        disabled={readOnlyMode}
                                        errorMessage={
                                            errors.comment?.message as string
                                        }
                                        style={{ gridColumn: "1 / 3" }}
                                        label="Комментарий"
                                        placeholder="Введите комментарий"
                                    />
                                    {user?.isAdmin && (
                                        <TextArea
                                            {...register(`commentForBotOwner`)}
                                            hidden={
                                                !activeFields.includes(
                                                    "commentForBotOwner"
                                                )
                                            }
                                            errorMessage={
                                                errors.commentForBotOwner
                                                    ?.message as string
                                            }
                                            style={{ gridColumn: "3 / 5" }}
                                            label="Комментарий  для разработчика"
                                            placeholder="Введите комментарий для разработчика"
                                        />
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                    {fields.map((field, index) => (
                        <div key={field.id} className="record-form__section">
                            {index > 0 && (
                                <div
                                    className="record-form__section-remove"
                                    onClick={removeApplicantHandler.bind(
                                        null,
                                        index
                                    )}
                                >
                                    <img
                                        src={removeIcon}
                                        width="16"
                                        height="18"
                                        alt="remove"
                                    />
                                </div>
                            )}
                            <Card>
                                <div className="record-form__applicant">
                                    <div className="record-form__subtitle">
                                        Информация о заявителе
                                    </div>
                                    <div className="record-form__applicant-fields">
                                        <TextField
                                            {...withHookFormMask(
                                                register(
                                                    `applicants.${index}.surname`
                                                ),
                                                "",
                                                {
                                                    regex: "[A-Za-z]*",
                                                    showMaskOnHover: false,
                                                    autoUnmask: true,
                                                    onUnMask: (value) =>
                                                        value.toUpperCase(),
                                                }
                                            )}
                                            disabled={readOnlyMode}
                                            uppercase
                                            hidden={
                                                !activeFields.includes(
                                                    "surname"
                                                )
                                            }
                                            errorMessage={
                                                errors.applicants?.[index]
                                                    ?.surname?.message as string
                                            }
                                            label={
                                                watchedCountry === "Usa"
                                                    ? "Фамилия (как в анкете)*"
                                                    : "Фамилия (латиницей)*"
                                            }
                                            placeholder="Введите фамилию"
                                        />
                                        <TextField
                                            {...withHookFormMask(
                                                register(
                                                    `applicants.${index}.firstName`
                                                ),
                                                "",
                                                {
                                                    regex: "[A-Za-z]*",
                                                    showMaskOnHover: false,
                                                    autoUnmask: true,
                                                    onUnMask: (value) =>
                                                        value.toUpperCase(),
                                                }
                                            )}
                                            disabled={readOnlyMode}
                                            uppercase
                                            hidden={
                                                !activeFields.includes(
                                                    "firstName"
                                                )
                                            }
                                            errorMessage={
                                                errors.applicants?.[index]
                                                    ?.firstName
                                                    ?.message as string
                                            }
                                            label={
                                                watchedCountry === "Usa"
                                                    ? "Имя (как в анкете)*"
                                                    : "Имя (латиницей)*"
                                            }
                                            placeholder="Введите имя"
                                        />
                                        <Select
                                            items={genderOptions}
                                            {...register(
                                                `applicants.${index}.gender`
                                            )}
                                            hidden={
                                                !activeFields.includes("gender")
                                            }
                                            disabled={readOnlyMode}
                                            errorMessage={
                                                errors.applicants?.[index]
                                                    ?.gender?.message as string
                                            }
                                            label="Пол*"
                                            placeholder="Укажите пол"
                                        />
                                        <TextField
                                            type="date"
                                            errorMessage={
                                                errors.applicants?.[index]
                                                    ?.dateOfBirth
                                                    ?.message as string
                                            }
                                            disabled={readOnlyMode}
                                            hidden={
                                                !activeFields.includes(
                                                    "dateOfBirth"
                                                )
                                            }
                                            label="Дата рождения*"
                                            inputRenderer={() => (
                                                <DatePicker
                                                    selected={getSelectedValue(
                                                        `applicants.${index}.dateOfBirth`
                                                    )}
                                                    className="text-field__input"
                                                    {...register(
                                                        `applicants.${index}.dateOfBirth`
                                                    )}
                                                    disabled={readOnlyMode}
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    onChange={(date) => {
                                                        setValue(
                                                            `applicants.${index}.dateOfBirth`,
                                                            date
                                                                ? format(
                                                                      date,
                                                                      "yyyy-MM-dd"
                                                                  )
                                                                : ""
                                                        );
                                                    }}
                                                    locale="ru"
                                                    dateFormat={[
                                                        "dd/MM/yyyy",
                                                        "ddMMyyyy",
                                                        "dd.MM.yyyy",
                                                    ]}
                                                    placeholderText="дд/мм/гггг"
                                                />
                                            )}
                                        />
                                        <Select
                                            items={getOptions(
                                                citizenshipOptions
                                            )}
                                            {...register(
                                                `applicants.${index}.citizenship`
                                            )}
                                            disabled={readOnlyMode}
                                            hidden={
                                                !activeFields.includes(
                                                    "citizenship"
                                                )
                                            }
                                            errorMessage={
                                                errors.applicants?.[index]
                                                    ?.citizenship
                                                    ?.message as string
                                            }
                                            label="Гражданство*"
                                            placeholder="Укажите гражданство"
                                        />
                                        <Select
                                            items={getOptions(
                                                passportTypeOptions
                                            )}
                                            {...register(
                                                `applicants.${index}.passportType`
                                            )}
                                            hidden={
                                                !activeFields.includes(
                                                    "passportType"
                                                )
                                            }
                                            disabled={readOnlyMode}
                                            errorMessage={
                                                errors.applicants?.[index]
                                                    ?.passportType
                                                    ?.message as string
                                            }
                                            label="Тип паспорта*"
                                            placeholder="Укажите тип паспорта"
                                        />
                                        <TextField
                                            {...register(
                                                `applicants.${index}.applicationNumber`
                                            )}
                                            hidden={
                                                !activeFields.includes(
                                                    "applicationNumber"
                                                )
                                            }
                                            disabled={readOnlyMode}
                                            errorMessage={
                                                errors.applicants?.[index]
                                                    ?.applicationNumber
                                                    ?.message as string
                                            }
                                            label={
                                                watchedCountry === "Usa"
                                                    ? "Номер анкеты ds-160*"
                                                    : "Номер анкеты*"
                                            }
                                            placeholder="Введите номер анкеты"
                                        />

                                        <TextField
                                            {...register(
                                                `applicants.${index}.passportNumber`
                                            )}
                                            {...withHookFormMask(
                                                register(
                                                    `applicants.${index}.passportNumber`
                                                ),
                                                "",
                                                {
                                                    regex: "[A-Za-z0-9]*",
                                                    autoUnmask: true,
                                                    placeholder: "",
                                                    showMaskOnHover: false,
                                                }
                                            )}
                                            disabled={readOnlyMode}
                                            hidden={
                                                !activeFields.includes(
                                                    "passportNumber"
                                                )
                                            }
                                            errorMessage={
                                                errors.applicants?.[index]
                                                    ?.passportNumber
                                                    ?.message as string
                                            }
                                            label="Номер загранпаспорта*"
                                            placeholder="Введите номер"
                                        />
                                        {currentCountry === "Ch" && (
                                            <>
                                                <TextField
                                                    {...withHookFormMask(
                                                        register(
                                                            `applicants.${index}.surname`
                                                        ),
                                                        "",
                                                        {
                                                            regex: "[A-Za-z]*",
                                                            showMaskOnHover:
                                                                false,
                                                            autoUnmask: true,
                                                            onUnMask: (value) =>
                                                                value.toUpperCase(),
                                                        }
                                                    )}
                                                    disabled={readOnlyMode}
                                                    uppercase
                                                    errorMessage={
                                                        errors.applicants?.[
                                                            index
                                                        ]?.surname
                                                            ?.message as string
                                                    }
                                                    label="Фамилия (латиницей)"
                                                    placeholder="Введите фамилию"
                                                />
                                                <TextField
                                                    {...withHookFormMask(
                                                        register(
                                                            `applicants.${index}.firstName`
                                                        ),
                                                        "",
                                                        {
                                                            regex: "[A-Za-z]*",
                                                            showMaskOnHover:
                                                                false,
                                                            autoUnmask: true,
                                                            onUnMask: (value) =>
                                                                value.toUpperCase(),
                                                        }
                                                    )}
                                                    disabled={readOnlyMode}
                                                    uppercase
                                                    errorMessage={
                                                        errors.applicants?.[
                                                            index
                                                        ]?.firstName
                                                            ?.message as string
                                                    }
                                                    label="Имя (латиницей)"
                                                    placeholder="Введите имя"
                                                />
                                                {isIndividualRecords && (
                                                    <>
                                                        <Checkbox
                                                            disabled={
                                                                !watch(
                                                                    `applicants.${index}.firstName`
                                                                ) ||
                                                                !watch(
                                                                    `applicants.${index}.surname`
                                                                )
                                                            }
                                                            label="Сделать подающим лицом"
                                                            id={`makeSubmittingPerson.${index}`}
                                                            style={{
                                                                alignSelf:
                                                                    "center",
                                                            }}
                                                            {...register(
                                                                `applicants.${index}.submittingPerson`,
                                                                {
                                                                    onChange:
                                                                        () => {
                                                                            setValue(
                                                                                `applicants.${index}.recordingDateFrom`,
                                                                                watch(
                                                                                    "recordingDateFrom"
                                                                                )
                                                                            );
                                                                            setValue(
                                                                                `applicants.${index}.recordingDateTo`,
                                                                                watch(
                                                                                    "recordingDateTo"
                                                                                )
                                                                            );
                                                                            setValue(
                                                                                `applicants.${index}.enableRecordingDateTo`,
                                                                                watch(
                                                                                    "enableRecordingDateTo"
                                                                                )
                                                                            );
                                                                            setValue(
                                                                                `applicants.${index}.enableRecordingDateFrom`,
                                                                                watch(
                                                                                    "enableRecordingDateFrom"
                                                                                )
                                                                            );
                                                                        },
                                                                }
                                                            )}
                                                        />
                                                        {watch(
                                                            `applicants.${index}.submittingPerson`
                                                        ) && (
                                                            <>
                                                                <TextField
                                                                    type="date"
                                                                    {...register(
                                                                        `applicants.${index}.recordingDateFrom`
                                                                    )}
                                                                    errorMessage={
                                                                        errors
                                                                            .recordingDateFrom
                                                                            ?.message as string
                                                                    }
                                                                    disabled={
                                                                        readOnlyMode
                                                                    }
                                                                    labelRenderer={() => (
                                                                        <>
                                                                            <div className="text-field__label">
                                                                                <Tooltip
                                                                                    id="my-tooltip"
                                                                                    style={{
                                                                                        width: "400px",
                                                                                        zIndex: 1,
                                                                                    }}
                                                                                />
                                                                                <a
                                                                                    className="tooltip-link"
                                                                                    data-tooltip-id="my-tooltip"
                                                                                    data-tooltip-content={
                                                                                        recordFromLabel[
                                                                                            watchedCountry
                                                                                        ]
                                                                                    }
                                                                                >
                                                                                    <Checkbox
                                                                                        label="Запись от"
                                                                                        id={`applicants.${index}.enableRecordingDateFrom`}
                                                                                        {...register(
                                                                                            `applicants.${index}.enableRecordingDateFrom`,
                                                                                            {
                                                                                                onChange:
                                                                                                    () => {
                                                                                                        setValue(
                                                                                                            `applicants.${index}.recordingDateFrom`,
                                                                                                            null
                                                                                                        );
                                                                                                    },
                                                                                            }
                                                                                        )}
                                                                                    />
                                                                                    <img
                                                                                        src={
                                                                                            questionIcon
                                                                                        }
                                                                                        width="24"
                                                                                        height="24"
                                                                                        alt="question"
                                                                                    />
                                                                                </a>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                    inputRenderer={() => (
                                                                        <DatePicker
                                                                            selected={getSelectedValue(
                                                                                `applicants.${index}.recordingDateFrom`
                                                                            )}
                                                                            className="text-field__input"
                                                                            {...register(
                                                                                `applicants.${index}.recordingDateFrom`
                                                                            )}
                                                                            showMonthDropdown
                                                                            showYearDropdown
                                                                            dropdownMode="select"
                                                                            disabled={
                                                                                !watch(
                                                                                    `applicants.${index}.enableRecordingDateFrom`
                                                                                ) ||
                                                                                readOnlyMode
                                                                            }
                                                                            onChange={(
                                                                                date
                                                                            ) => {
                                                                                setValue(
                                                                                    `applicants.${index}.recordingDateFrom`,
                                                                                    date
                                                                                        ? format(
                                                                                              date,
                                                                                              "yyyy-MM-dd"
                                                                                          )
                                                                                        : null,
                                                                                    {
                                                                                        shouldDirty:
                                                                                            true,
                                                                                    }
                                                                                );
                                                                            }}
                                                                            selectsStart
                                                                            locale="ru"
                                                                            dateFormat={[
                                                                                "dd/MM/yyyy",
                                                                                "ddMMyyyy",
                                                                                "dd.MM.yyyy",
                                                                            ]}
                                                                            placeholderText="дд/мм/гггг"
                                                                        />
                                                                    )}
                                                                />
                                                                <TextField
                                                                    type="date"
                                                                    {...register(
                                                                        `applicants.${index}.recordingDateTo`
                                                                    )}
                                                                    disabled={
                                                                        readOnlyMode
                                                                    }
                                                                    errorMessage={
                                                                        errors
                                                                            .recordingDateTo
                                                                            ?.message as string
                                                                    }
                                                                    labelRenderer={() => (
                                                                        <div className="text-field__label">
                                                                            <Checkbox
                                                                                id={`applicants.${index}.enableRecordingDateTo`}
                                                                                label="Запись до"
                                                                                {...register(
                                                                                    `applicants.${index}.enableRecordingDateTo`,
                                                                                    {
                                                                                        onChange:
                                                                                            () => {
                                                                                                setValue(
                                                                                                    `applicants.${index}.recordingDateTo`,
                                                                                                    null
                                                                                                );
                                                                                            },
                                                                                    }
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    inputRenderer={() => (
                                                                        <DatePicker
                                                                            selected={getSelectedValue(
                                                                                `applicants.${index}.recordingDateTo`
                                                                            )}
                                                                            className="text-field__input"
                                                                            {...register(
                                                                                `applicants.${index}.recordingDateTo`
                                                                            )}
                                                                            disabled={
                                                                                !watch(
                                                                                    `applicants.${index}.enableRecordingDateTo`
                                                                                ) ||
                                                                                readOnlyMode
                                                                            }
                                                                            showMonthDropdown
                                                                            showYearDropdown
                                                                            dropdownMode="select"
                                                                            onChange={(
                                                                                date
                                                                            ) => {
                                                                                setValue(
                                                                                    `applicants.${index}.recordingDateTo`,
                                                                                    date
                                                                                        ? format(
                                                                                              date,
                                                                                              "yyyy-MM-dd"
                                                                                          )
                                                                                        : null,
                                                                                    {
                                                                                        shouldDirty:
                                                                                            true,
                                                                                    }
                                                                                );
                                                                            }}
                                                                            selectsEnd
                                                                            startDate={getSelectedValue(
                                                                                `applicants.${index}.recordingDateFrom`
                                                                            )}
                                                                            endDate={getSelectedValue(
                                                                                `applicants.${index}.recordingDateTo`
                                                                            )}
                                                                            locale="ru"
                                                                            dateFormat={[
                                                                                "dd/MM/yyyy",
                                                                                "ddMMyyyy",
                                                                                "dd.MM.yyyy",
                                                                            ]}
                                                                            placeholderText="дд/мм/гггг"
                                                                        />
                                                                    )}
                                                                />
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                        <TextField
                                            type="date"
                                            {...register(
                                                `applicants.${index}.passportDateOfIssue`
                                            )}
                                            hidden={
                                                !activeFields.includes(
                                                    "passportDateOfIssue"
                                                )
                                            }
                                            disabled={readOnlyMode}
                                            errorMessage={
                                                errors.applicants?.[index]
                                                    ?.passportDateOfIssue
                                                    ?.message as string
                                            }
                                            label="Дата выдачи паспорта*"
                                            inputRenderer={() => (
                                                <DatePicker
                                                    selected={getSelectedValue(
                                                        `applicants.${index}.passportDateOfIssue`
                                                    )}
                                                    className="text-field__input"
                                                    {...register(
                                                        `applicants.${index}.passportDateOfIssue`
                                                    )}
                                                    disabled={readOnlyMode}
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    onChange={(date) => {
                                                        setValue(
                                                            `applicants.${index}.passportDateOfIssue`,
                                                            date
                                                                ? format(
                                                                      date,
                                                                      "yyyy-MM-dd"
                                                                  )
                                                                : ""
                                                        );
                                                    }}
                                                    locale="ru"
                                                    dateFormat={[
                                                        "dd/MM/yyyy",
                                                        "ddMMyyyy",
                                                        "dd.MM.yyyy",
                                                    ]}
                                                    placeholderText="дд/мм/гггг"
                                                />
                                            )}
                                        />
                                        <TextField
                                            type="date"
                                            {...register(
                                                `applicants.${index}.passportExpireDate`
                                            )}
                                            hidden={
                                                !activeFields.includes(
                                                    "passportExpireDate"
                                                )
                                            }
                                            errorMessage={
                                                errors.applicants?.[index]
                                                    ?.passportExpireDate
                                                    ?.message as string
                                            }
                                            disabled={readOnlyMode}
                                            label="Дата истечения срока действия паспорта*"
                                            inputRenderer={() => (
                                                <DatePicker
                                                    selected={getSelectedValue(
                                                        `applicants.${index}.passportExpireDate`
                                                    )}
                                                    className="text-field__input"
                                                    {...register(
                                                        `applicants.${index}.passportExpireDate`
                                                    )}
                                                    disabled={readOnlyMode}
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    onChange={(date) => {
                                                        setValue(
                                                            `applicants.${index}.passportExpireDate`,
                                                            date
                                                                ? format(
                                                                      date,
                                                                      "yyyy-MM-dd"
                                                                  )
                                                                : ""
                                                        );
                                                    }}
                                                    locale="ru"
                                                    dateFormat={[
                                                        "dd/MM/yyyy",
                                                        "ddMMyyyy",
                                                        "dd.MM.yyyy",
                                                    ]}
                                                    placeholderText="дд/мм/гггг"
                                                />
                                            )}
                                        />
                                        <TextField
                                            {...withHookFormMask(
                                                register(
                                                    `applicants.${index}.passportPlaceOfIssue`
                                                ),
                                                "",
                                                {
                                                    regex: "[A-Za-z0-9]*",
                                                    showMaskOnHover: false,
                                                    autoUnmask: true,
                                                    onUnMask: (value) =>
                                                        value.toUpperCase(),
                                                }
                                            )}
                                            disabled={readOnlyMode}
                                            uppercase
                                            hidden={
                                                !activeFields.includes(
                                                    "passportPlaceOfIssue"
                                                )
                                            }
                                            errorMessage={
                                                errors.applicants?.[index]
                                                    ?.passportPlaceOfIssue
                                                    ?.message as string
                                            }
                                            label="Место выдачи паспорта*"
                                            placeholder="Укажите место выдачи паспорта"
                                        />
                                        <TextField
                                            {...withHookFormMask(
                                                register(
                                                    `applicants.${index}.phoneNumber`
                                                ),
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
                                            disabled={readOnlyMode}
                                            placeholder="+7"
                                            hidden={
                                                !activeFields.includes(
                                                    "phoneNumber"
                                                )
                                            }
                                            errorMessage={
                                                errors.applicants?.[index]
                                                    ?.phoneNumber
                                                    ?.message as string
                                            }
                                            label="Контактный номер телефона*"
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                    <div className="buttons-container">
                        <Button
                            type="submit"
                            disabled={!isValid || readOnlyMode}
                            dense
                            title="Подтвердить запись"
                        />
                        <Button
                            iconLeft={addIcon}
                            dense
                            disabled={addApplicantDisabled || readOnlyMode}
                            title="Добавить дополнительного заявителя"
                            onClick={appendApplicantHandler}
                        />
                    </div>
                </form>
            </WithLoading>
        </>
    );
}
