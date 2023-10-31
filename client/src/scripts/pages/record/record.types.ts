import type { Status } from "@shared/components/ui/Tile/Tile";

export interface PaginatedList<T> {
    count: number;
    rows: T[];
}

export interface RecordRequest {
    id: number;
    email: string;
    agent: string;
    firstName: string;
    surname: string;
    phoneNumber: string;
    residenceCountry: string;
    destinationCountry: string;
    visaCenter: string;
    city: string;
    recordCategory: string;
    visaCategory: string;
    visaSubcategory: string;
    status: string;
    payment: boolean;
    postPayment: boolean;
    recordingDateOffset: string;
    recordingDateFrom: Nullable<string>;
    recordingDateTo: Nullable<string>;
    enableRecordingDateOffset: boolean;
    enableRecordingDateFrom: boolean;
    enableRecordingDateTo: boolean;
    login: string;
    password: string;
    comment: string;
    commentForBotOwner: string;
    cities: string[];
    applicants: Applicant[];
    withdrawalId?: number;
    paidToBotOwnerStatus: string;
    type?: string;
    ignoreSecretFields?: boolean;
}

export interface Record {
    id: number;
    email: string;
    firstName: string;
    surname: string;
    phoneNumber: string;
    visaCenter: string;
    city: string;
    destinationCountry: string;
    status: Status;
    payment: boolean;
    recordCategory: string;
    recordingDate: string;
    editable: boolean;
    postPayment: boolean;
    agent: string;
    new: boolean;
    applicationNumber: string;
    price: number;
    removable: boolean;
    paidToBotOwnerStatus: string;
    selected: boolean;
    recordingDateFrom: Nullable<string>;
    recordingDateTo: Nullable<string>;
    recordingDateOffset: string;
    enableRecordingDateFrom: boolean;
    enableRecordingDateTo: boolean;
    enableRecordingDateOffset: boolean;
    createdAt: string;
    updatedAt: string;
    comment: string;
    commentForBotOwner: string;
    applicants: Applicant[];
    withdrawalId?: number;
    errorMessage: string | undefined;
    confirmationFile?: string;
    paymentCode?: number;
    paymentType?: string;
    type?: string;
}

export interface RecordExpanded {
    errorMessage: string | undefined;
    id: number;
    agent: string;
    group: boolean;
    groupFirstEl: boolean;
    visaCenter: string;
    city: string;
    surname: string;
    firstName: string;
    recordCategory: string;
    recordId: number;
    passportNumber: string;
    applicationNumber: string;
    destinationCountry: string;
    status: Status;
    payment: boolean;
    commentForBotOwner: string;
    postPayment: boolean;
    paidToBotOwnerStatus: string;
    recordingDate: string;
    price: number;
    new: boolean;
    editable: boolean;
    removable: boolean;
    selected: boolean;
    recordingDateFrom: Nullable<string>;
    recordingDateTo: Nullable<string>;
    enableRecordingDateFrom: boolean;
    enableRecordingDateTo: boolean;
    applicants: Applicant[];
    createdAt: string;
    updatedAt: string;
    withdrawalId?: number;
    botOwner?: string;
    confirmationFile?: string;
    canChangeBotPaymentStatus: boolean;
    confirmationFileExists: boolean;
    applicantError: string;
    paymentCode?: number;
    paymentType?: string;
    type?: string;
    disabled: boolean;
}

export interface Applicant {
    surname: string;
    firstName: string;
    gender: 1 | 2 | 3;
    dateOfBirth: string;
    citizenship: string;
    passportType: string;
    passportNumber: string;
    passportExpireDate: string;
    passportPlaceOfIssue: string;
    passportDateOfIssue: string;
    phoneNumber: string;
    applicationNumber: string;
    error: string;
    submittingPerson: boolean;
    recordingDateFrom: Nullable<string>;
    recordingDateTo: Nullable<string>;
    enableRecordingDateFrom: boolean;
    enableRecordingDateTo: boolean;
}

export interface Price {
    id: number;
    label: string;
    value: string;
    priceStandardCapital: number;
    priceStandardRegion: number;
    priceVipCapital: number;
    priceVipRegion: number;
    capitals: string[];
}
