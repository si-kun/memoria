"use server"

import { prisma } from "@/utils/prisma/prismaClient"

export const getFolder = async (userId: string) => {
    try {
        const folder = await prisma.folder.findMany({
            where: {
                userId,
            },
            include: {
                notes: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
                _count: {
                    select: {
                        notes: true,
                    }
                }
            },
        })

        return {
            success: true,
            data: folder,
        }
    } catch(error) {
        return {
            success: false,
            error: error,
        }
    }
}