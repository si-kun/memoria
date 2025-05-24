"use server";

import { prisma } from "@/utils/prisma/prismaClient";

export const getTags = async (userId: string) => {
    try {
        const tags = await prisma.tag.findMany({
            where: {
                note: {
                    is: {
                        userId,
                    }
                },
            },
            include: {
                _count: {
                    select: {
                        note: true,
                    }
                }
            }
        })

        return {
            success: true,
            message: "タグの取得に成功しました",
            data: tags,
        }
    } catch(error) {
        console.error(error);
        return {
            success: false,
            message: "タグの取得に失敗しました",
        }
    }

}