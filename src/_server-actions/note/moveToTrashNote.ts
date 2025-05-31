"use server";

import { prisma } from "@/utils/prisma/prismaClient";

export const moveToTrashNote = async (id: string) => {
  try {
    const trashNote = await prisma.note.findUnique({
      where: { id },
    });

    if (!trashNote) {
      return { success: false, error: "Note not found." };
    }

    const isTrash = trashNote.deletedAt !== null;

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        deletedAt: isTrash ? null : new Date(),
      },
    });

    return {
      success: true,
      data: updatedNote,
    };
  } catch (error) {
    console.error("Error moving note to trash:", error);
    return { success: false, error: "Failed to move note to trash." };
  }
};
