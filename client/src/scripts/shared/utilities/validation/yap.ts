import * as yup from "yup";

export const authSchema = yup.object({
    email: yup
        .string()
        .email("Некорректный email")
        .required("Обязательное поле"),
    password: yup.string().required("Обязательное поле"),
});

export const passwordChangeSchema = yup.object({
    password: yup.string().required("Обязательное поле"),
    repeatPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Пароли не совпадают")
        .required("Обязательное поле"),
});

export const employeeSchema = yup.object({
    email: yup
        .string()
        .email("Некорректный email")
        .required("Обязательное поле"),
    password: yup.string().required("Обязательное поле"),
});

export const regSchema = authSchema.shape({
    repeatPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Пароли не совпадают")
        .required("Обязательное поле"),
});

export const emailSchemaSchema = yup.object({
    email: yup
        .string()
        .email("Некорректный email")
        .required("Обязательное поле"),
});

export const resetPasswordSchema = yup.object({
    password: yup.string().required("Обязательное поле"),
    repeatPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Пароли не совпадают")
        .required("Обязательное поле"),
});

export const recordSchema = yup.object().shape({
    residenceCountry: yup.string().required("Обязательное поле"),
    destinationCountry: yup.string().required("Обязательное поле"),
    visaCenter: yup.string().required("Обязательное поле"),
    visaCategory: yup.string().required("Обязательное поле"),
    visaSubcategory: yup.string().when("destinationCountry", {
        is: "Fr",
        then: yup.string().required("Обязательное поле"),
        otherwise: yup.string().nullable(),
    }),
    recordingDateFrom: yup.string().when("enableRecordingDateFrom", {
        is: true,
        then: yup.string().required("Обязательное поле"),
        otherwise: yup.string().nullable(),
    }),
    recordingDateTo: yup.string().when("enableRecordingDateTo", {
        is: true,
        then: yup.string().required("Обязательное поле"),
        otherwise: yup.string().nullable(),
    }),
    recordingDateOffset: yup
        .number()
        .transform((value) => (Number.isNaN(value) ? null : value))
        .nullable()
        .min(1, "Значение должно быть минимум 1 день")
        .max(10, "Значение не должно превышать 10 дней"),
    applicants: yup.array().of(
        yup.object().shape({
            surname: yup.string().required("Обязательное поле"),
            firstName: yup.string().required("Обязательное поле"),
            gender: yup.string().required("Обязательное поле"),
            dateOfBirth: yup.string().required("Обязательное поле"),
            citizenship: yup.string().required("Обязательное поле"),
            passportType: yup.string().when("destinationCountry", {
                is: "Sp",
                then: yup.string().required("Обязательное поле"),
                otherwise: yup.string().nullable(),
            }),
            passportNumber: yup.string().required("Обязательное поле"),
            passportExpireDate: yup.string().required("Обязательное поле"),
            passportPlaceOfIssue: yup.string().when("destinationCountry", {
                is: "Sp",
                then: yup.string().required("Обязательное поле"),
                otherwise: yup.string().nullable(),
            }),
            passportDateOfIssue: yup.string().when("destinationCountry", {
                is: "Sp",
                then: yup.string().required("Обязательное поле"),
                otherwise: yup.string().nullable(),
            }),
            phoneNumber: yup
                .string()
                .required("Обязательное поле")
                .length(10, "Номер телефона должен состоять из 11 символов"),
        })
    ),
});

export const userIndividualSchema = yup.object().shape({
    fio: yup.string().nullable().required("Обязательное поле"),
    inn: yup.string().nullable().required("Обязательное поле"),
    phoneNumber: yup
        .string()
        .nullable()
        .required("Обязательное поле")
        .length(10, "Номер телефона должен состоять из 11 символов"),
    email: yup
        .string()
        .email("Некорректный email")
        .required("Обязательное поле"),
});

export const userAdminSchema = yup.object().shape({
    fio: yup.string().nullable().required("Обязательное поле"),
    email: yup
        .string()
        .email("Некорректный email")
        .required("Обязательное поле"),
});

export const userCompanySchema = yup.object().shape({
    companyName: yup.string().nullable().required("Обязательное поле"),
    companyAddress: yup.string().nullable(),
    inn: yup.string().nullable().required("Обязательное поле"),
    registrationNumber: yup.string().nullable(),
    paymentAccount: yup.string().nullable(),
    bank: yup.string().nullable(),
    bankId: yup.string().nullable(),
    correspondentAccount: yup.string().nullable(),
    phoneNumber: yup
        .string()
        .nullable()
        .required("Обязательное поле")
        .length(10, "Номер телефона должен состоять из 11 символов"),
    email: yup
        .string()
        .email("Некорректный email")
        .required("Обязательное поле"),
    contact: yup.string().nullable().required("Обязательное поле"),
});

export const userBotOwnerSchema = yup.object().shape({
    fio: yup.string().nullable().required("Обязательное поле"),
    telegram: yup.string().nullable().required("Обязательное поле"),
    phoneNumber: yup
        .string()
        .nullable()
        .required("Обязательное поле")
        .length(10, "Номер телефона должен состоять из 11 символов"),
    email: yup
        .string()
        .email("Некорректный email")
        .required("Обязательное поле"),
});

export const chinaRecordSchema = yup.object().shape({
    residenceCountry: yup.string().required("Обязательное поле"),
    destinationCountry: yup.string().required("Обязательное поле"),
    firstName: yup.string().required("Обязательное поле"),
    surname: yup.string().required("Обязательное поле"),
    phoneNumber: yup.string().required("Обязательное поле"),
    city: yup.string().required("Обязательное поле"),
    email: yup
        .string()
        .email("Некорректный email")
        .required("Обязательное поле"),
    recordingDateOffset: yup
        .number()
        .transform((value) => (Number.isNaN(value) ? null : value))
        .nullable()
        .min(1, "Значение должно быть минимум 1 день")
        .max(10, "Значение не должно превышать 10 дней"),
    recordingDateFrom: yup.string().when("enableRecordingDateFrom", {
        is: true,
        then: yup.string().required("Обязательное поле"),
        otherwise: yup.string().nullable(),
    }),
    recordingDateTo: yup.string().when("enableRecordingDateTo", {
        is: true,
        then: yup.string().required("Обязательное поле"),
        otherwise: yup.string().nullable(),
    }),
    applicants: yup.array().of(
        yup.object().shape({
            applicationNumber: yup
                .string()
                .required("Обязательное поле")
                .max(19, "Номер анкеты не должен превышать 19 символов"),
            passportNumber: yup.string().required("Обязательное поле"),
        })
    ),
});

export const usaRecordSchema = yup.object().shape({
    residenceCountry: yup.string().required("Обязательное поле"),
    destinationCountry: yup.string().required("Обязательное поле"),
    visaCenter: yup.string().required("Обязательное поле"),
    recordingDateFrom: yup.string().when("enableRecordingDateFrom", {
        is: true,
        then: yup.string().required("Обязательное поле"),
        otherwise: yup.string().nullable(),
    }),
    recordingDateTo: yup.string().when("enableRecordingDateTo", {
        is: true,
        then: yup.string().required("Обязательное поле"),
        otherwise: yup.string().nullable(),
    }),
    applicants: yup.array().of(
        yup.object().shape({
            surname: yup.string().required("Обязательное поле"),
            firstName: yup.string().required("Обязательное поле"),
            applicationNumber: yup.string().when("visaCenter", {
                is: "Маврикий",
                then: yup.string().nullable(),
                otherwise: yup.string().required("Обязательное поле"),
            }),
            passportNumber: yup.string().required("Обязательное поле"),
            phoneNumber: yup
                .string()
                .required("Обязательное поле")
                .length(10, "Номер телефона должен состоять из 11 символов"),
        })
    ),
});

export const supportSchema = yup.object({
    surname: yup.string().required("Обязательное поле"),
    firstName: yup.string().required("Обязательное поле"),
    email: yup
        .string()
        .email("Некорректный email")
        .required("Обязательное поле"),
    phoneNumber: yup.string().required("Обязательное поле"),
    comment: yup.string().required("Обязательное поле"),
});
