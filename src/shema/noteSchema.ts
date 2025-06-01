import { z } from "zod";

export const noteSchema = z.object({
    id: z.string().uuid(),
    title: z
      .string()
      .min(1, { message: "Title is required minimum 1 character" })
      .max(20, { message: "Title is required maximum 20 character" }),
    content: z
      .string()
      .min(1, { message: "Content is required minimum 1 character" }),

    //フォルダ
    newFolder: z.string().optional(),
    selectedFolder: z.string().optional(),
    folderName: z.string().min(1, {message: "Folder is required"}).max(12, {message: "Folder is required maximum 12 character"}).optional(),
    tags: z.array(z.string()),
    unScheduled: z.boolean(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    isPublic: z.boolean(),
    isFavorite: z.boolean().optional(),
    deletedAt: z.date().nullable().optional(),
  });