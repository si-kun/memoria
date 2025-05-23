"use server"

import { prisma } from "@/utils/prisma/prismaClient"

export const getFolder = async (userId: string) => {
    try {

        await prisma.folder.deleteMany({
            where: {
                userId,
                notes: {
                    none: {},
                }
            }
        })

        const folders = await prisma.folder.findMany({
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
            data: folders,
        }
    } catch(error) {
        return {
            success: false,
            error: error,
        }
    }
}