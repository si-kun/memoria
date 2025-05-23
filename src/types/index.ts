import { Note, Tag } from "@prisma/client";

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

export interface NoteDetailData extends Note {
    tags: Tag[];
}

export interface NoteDataUpdate {
    id: string;
    title: string;
    tags: string[];
    unScheduled: boolean;
    startDate: Date | null;
    endDate: Date | null;
    folderName: string | undefined;
    public: boolean;
    content: string;
}

