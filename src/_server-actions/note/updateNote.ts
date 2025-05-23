"use server";

import { NoteDataUpdate } from "@/types";
import { prisma } from "@/utils/prisma/prismaClient";
import { v4 as uuidv4 } from "uuid";

export const updateNote = async (note: NoteDataUpdate, userId: string) => {
  try {
    const {
      id,
      title,
      content,
      folderName,
      public: isPublic,
      unScheduled,
      tags,
      startDate,
      endDate,
    } = note;

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

    const updatedNote = await prisma.note.update({
      where: {
        id,
        userId,
      },
      data: {
        title,
        content,
        folderId: folder.id,
        public: isPublic,
        unScheduled,
        startDate,
        endDate,
      },
    });

    // const tagNames = tags.map(tag => tag.name);
    const existingTags = await prisma.tag.findMany({
        where: {noteId: id},
    })

    const newTagName = new Set(tags);
    const oldTagName = new Set(existingTags.map(tag => tag.name));

    const tagsToDelete = [...oldTagName].filter((tag) => !newTagName.has(tag));

    await prisma.tag.deleteMany({
      where: { noteId: id, name: { in: tagsToDelete } },
    });

    for (const tag of tags) {
      await prisma.tag.upsert({
        where: {
          name_noteId: {
            name: tag,
            noteId: id,
          },
        },
        update: {},
        create: {
          id: uuidv4(),
          name: tag,
          noteId: id,
        },
      });
    }

    return {
        success: true,
        message: "Note updated successfully",
        data: updatedNote,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
};
