"use server";

import { prisma } from "@/utils/prisma/prismaClient";

export const deleteNote = async (id: string) => {
  try {
    await prisma.tagOnNote.deleteMany({
      where: {
        noteId: id,
      },
    });

    await prisma.note.delete({
      where: {
        id: id,
      },
    });
    return {
      success: true,
      message: "Note deleted successfully",
    };
  } catch (error) {
    console.error("Failed to delete note", error);
    return {
      success: false,
      error: "Failed to delete note",
    };
  }
};
