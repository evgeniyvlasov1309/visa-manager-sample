export interface ResetPasswordRequestFormData {
    email: string;
    password: string;
    repeatPassword: string;
}

export interface GetResetLinkRequest {
    email: string;
}

export interface ResetPasswordRequest {
    password: string;
    resetPasswordToken: string;
}
