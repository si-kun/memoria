"use server";

import { NoteData } from "@/types";
import { prisma } from "@/utils/prisma/prismaClient";
import { v4 as uuidv4 } from "uuid";

export const updateNote = async (note: NoteData, userId: string) => {
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
      favorite,
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
        favorite,
      },
    });

    await prisma.tagOnNote.deleteMany({
      where: {
        noteId: id,
      }
    })


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
          id: true, // ← これが大事！！
        },
      });
    
      await prisma.tagOnNote.create({
        data: {
          noteId: id,
          tagId: createdTag.id,
        },
      });
    }
    

    return {
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error,
    };
  }
};
