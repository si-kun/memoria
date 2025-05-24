import { Folder, Note, Tag } from "@prisma/client";
import { atom } from "jotai";

export const allNoteAtom = atom<Note[]>([])

export const todayNoteAtom = atom<Note[]>([])

export const comingUpNoteAtom = atom<Note[]>([])

export const unscheduledNoteAtom = atom<Note[]>([])

export const folderAtom = atom<Folder[]>([])

export const tagsAtom = atom<Tag[]>([])
