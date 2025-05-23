"use server";

import { prisma } from "@/utils/prisma/prismaClient";

export const getNoteDetail = async (noteId: string) => {
  try {
    const result = await prisma.note.findUnique({
      where: {
        id: noteId,
      },
      include: {
        tags: {
          select: {
            name: true,
          },
        },
        folder: true,
      },
    });

    if (!result) {
      return {
        success: false,
        message: "Note not found",
      };
    }

    const notoData = {
      ...result,
      tags: result.tags,
      folderName: result.folder?.folderName ?? "",
    }

    return {
      success: true,
      data: notoData,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to edit note",
      error: error,
    };
  }
};
