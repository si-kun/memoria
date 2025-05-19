"use server";

import { AddNoteDataFrom } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/utils/prisma/prismaClient";

export const addNewNoteActions = async (
  addNote: AddNoteDataFrom,
  userId: string
) => {
  const {
    title,
    content,
    folderName,
    public: isPublic,
    startDate,
    endDate,
    unScheduled,
    tags,
  } = addNote;

  try {
    // フォルダの取得
    const folder =
      (await prisma.folder.findUnique({
        where: {
          folderName_userId: {
            folderName,
            userId,
          },
        },
      })) ??
      (await prisma.folder.create({
        data: {
          id: uuidv4(),
          folderName,
          userId,
        },
      }));

    // ノートの作成
    const newNote = await prisma.note.create({
      data: {
        id: uuidv4(),
        title,
        content,
        folderId: folder.id,
        userId,
        unScheduled,
        public: isPublic,
        startDate,
        endDate,
      },
    });

    // タグの作成
    for (const tag of tags) {
        await prisma.tag.upsert({
            where: {
                name_noteId: {
                    name: tag,
                    noteId: newNote.id,
                }
            },
            update: {},
        create: {
          id: uuidv4(),
          name: tag,
          noteId: newNote.id,
        },
      });
    }

    return {
      success: true,
      message: "Note created successfully",
      data: newNote,
    };
  } catch (error) {
    console.error("Note creation error:", error);
    return {
      success: false,
      error: "Failed to add new note",
    };
  }
};
