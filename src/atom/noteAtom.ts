import { FolderWithCount, TagWithCount } from "@/types";
import {  Note } from "@prisma/client";
import { atom } from "jotai";

export const allNoteAtom = atom<Note[]>([])

export const todayNoteAtom = atom<Note[]>([])

export const comingUpNoteAtom = atom<Note[]>([])

export const unscheduledNoteAtom = atom<Note[]>([])

export const favoriteNoteAtom = atom<Note[]>([])

export const trashNoteAtom = atom<Note[]>([])

export const folderAtom = atom<FolderWithCount[]>([])

export const tagsAtom = atom<TagWithCount[]>([])
