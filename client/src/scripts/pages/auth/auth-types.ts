export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface AuthRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface AuthRequestFormData extends AuthRequest {
    repeatPassword: string;
}

export interface PasswordChangeRequest {
    password: string;
}

export interface PasswordChangeRequestRequestFormData
    extends PasswordChangeRequest {
    repeatPassword: string;
}

export interface User {
    id: number;
    avatar: string;
    telegram: string;
    companyName: string;
    companyAddress: string;
    registrationNumber: string;
    paymentAccount: string;
    bank: string;
    bankId: string;
    correspondentAccount: string;
    email: string;
    type: UserType;
    fio: string;
    address: string;
    phoneNumber: string;
    inn: string;
    contact: string;
    isAdmin: boolean;
    vip: boolean;
    commissionPercentage: number;
    secretFields: {
        firstName: string;
        surname: string;
        phoneNumber: string;
        email: string;
    };
    permanentFields: {
        firstName: string;
        surname: string;
        phoneNumber: string;
        email: string;
    };
    prices: string;
    paymentMethod: "cash" | "card";
    discussedPrice: number;
    agencyId: number;
    notificationEmail: string;
    notificationEmailEnabled: boolean;
    notificationTelegram: string;
    notificationTelegramEnabled: boolean;
    createdAt: string;
}

export interface UserRequest {
    id: number;
    avatar: string;
    telegram: string;
    companyName: string;
    companyAddress: string;
    registrationNumber: string;
    paymentAccount: string;
    bank: string;
    bankId: string;
    correspondentAccount: string;
    email: string;
    type: UserType;
    fio: string;
    address: string;
    phoneNumber: string;
    inn: string;
    contact: string;
    isAdmin: boolean;
    vip: boolean;
    commissionPercentage: number;
    secretFields: {
        firstName: string;
        surname: string;
        phoneNumber: string;
        email: string;
    };
    permanentFields: {
        firstName: string;
        surname: string;
        phoneNumber: string;
        email: string;
    };
    prices: string;
    paymentMethod: "cash" | "card";
    discussedPrice: number;
    employees: {
        fio: string;
        phoneNumber: string[];
        email: string;
        telegram: string;
    }[];
    createdAt: string;
    notificationEmail: string;
    notificationEmailEnabled: boolean;
    notificationTelegram: string;
    notificationTelegramEnabled: boolean;
    agencyId: number;
}

export type UserType = "person" | "company" | "botOwner";
