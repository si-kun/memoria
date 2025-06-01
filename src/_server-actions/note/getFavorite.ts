"use server"

import { prisma } from "@/utils/prisma/prismaClient";

export const getFavorite = async (userId: string) => {
    try {
        const favoriteNotes = await prisma.note.findMany({
            where: {
                userId,
                isFavorite: true,
                deletedAt: null,
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return {
            success: true,
            data: favoriteNotes
        }
    } catch(error) {
        console.error("Error fetching favorite notes:", error);
        return {
            success: false,
            error: "Failed to fetch favorite notes"
        }
    }
}