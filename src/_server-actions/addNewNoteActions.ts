"use server";

import { NoteData } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/utils/prisma/prismaClient";

export const addNewNoteActions = async (addNote: NoteData, userId: string) => {
  const {
    title,
    content,
    folderName,
    public: isPublic,
    startDate,
    endDate,
    unScheduled,
    tags = [],
    deletedAt = null,
    favorite,
  } = addNote;

  try {
    // フォルダの取得
    const folder =
      (await prisma.folder.findUnique({
        where: {
          folderName_userId: {
            folderName: folderName || "",
            userId,
          },
        },
      })) ??
      (await prisma.folder.create({
        data: {
          id: uuidv4(),
          folderName: folderName || "",
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
        startDate: startDate ?? null,
        endDate: endDate ?? null,
        deletedAt: deletedAt ?? null,
        favorite,
      },
    });

    // タグの作成
    for (const tag of tags) {
      const createdTag = await prisma.tag.upsert({
        where: {
          name_userId: {
            name: tag,
            userId,
          },
        },
        update: {},
        create: {
          id: uuidv4(),
          name: tag,
          userId,
        },
        select: {
          id: true,
        },
      });

      await prisma.tagOnNote.create({
        data: {
          noteId: newNote.id,
          tagId: createdTag.id,
        },
      });
    }

    return {
      success: true,
      message: "Note created successfully",
      data: newNote,
    };
  } catch (error) {
    console.error("Note creation error:", JSON.stringify(error, null, 2));
    return {
      success: false,
      error: "Failed to add new note",
    };
  }
};
