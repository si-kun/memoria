"use server";

import { prisma } from "@/utils/prisma/prismaClient";

export const getTags = async (userId: string) => {
    try {

        //未使用のタグをクリーンアップ
        await prisma.tag.deleteMany({
            where: {
                userId,
                notes: {
                    none: {},
                }
            }
        })

        const tags = await prisma.tag.findMany({
            where: {
                userId,
            },
            include: {
                _count: {
                    select: {
                        notes: true,
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