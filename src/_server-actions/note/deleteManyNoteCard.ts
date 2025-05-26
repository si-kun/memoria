"use server";

import { prisma } from "@/utils/prisma/prismaClient";

export const deleteManyNoteCard = async (ids: string[]) => {
    try {

        await prisma.tagOnNote.deleteMany({
            where: {
                noteId: {
                    in: ids,
                }
            }
        })

        await prisma.note.deleteMany({
            where: {
                id: {
                    in: ids,
                }
            }
        })

        return {
            success: true,
            message: "Note card deleted successfully",
        }

    } catch(error) {
        console.error(error);
        return {
            success: false,
            error: "Failed to delete note card",
        }
    }
}