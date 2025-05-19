"use server"

import { prisma } from "@/utils/prisma/prismaClient"

export const getAllNote = async (userId: string) => {
  try {
    const notes = await prisma.note.findMany({
        where: {
            userId: userId
        },
        include: {
            folder: true,
            tags: true,
        }
    })

    return {
        success: true,
        data: notes,
    }

  } catch(error) {
    console.log(error);
    return {
        success: false,
        error: "Failed to get all notes",
    }
  }
}