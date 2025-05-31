"use server";

import { prisma } from "@/utils/prisma/prismaClient";

export const getNoteTrash = async(userId: string) => {
    try {
        const trashNotes = await prisma.note.findMany({
            where: {
                userId,
                deletedAt: {
                    not: null
                }
            }
        })
        return {
            success: true,
            data: trashNotes
        }
    } catch(error) {
        console.error("Error fetching trash notes:", error);
        return { success: false, error: "Failed to fetch trash notes." };
    }
}