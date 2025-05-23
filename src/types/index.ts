export interface AuthBaseData {
    email: string;
    password: string;
}

export interface SignupData extends AuthBaseData {
    displayName: string;
    avatar?: File;
}

export interface SigninData extends AuthBaseData {
    id?: string;
    displayName?: string;
    avatar?: File | null;
}

export interface AddNoteDataFrom {
    id: string;
    title: string;
    tags: string[];
    unScheduled: boolean;
    startDate: Date;
    endDate: Date;
    folderName: string;
    public: boolean;
    content: string;
}