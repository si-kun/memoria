
export interface AuthBaseData {
    email: string;
    password: string;
}

export interface SignupData extends AuthBaseData {
    displayName: string;
    avatar: File | null;
}

export interface SigninData extends AuthBaseData {
    id?: string;
    displayName?: string;
    avatar?: File | null;
}
