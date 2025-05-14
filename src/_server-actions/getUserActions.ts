"use server"

import { prisma } from "@/utils/prisma/prismaClient"

export const getUserActions = async(userId: string) => {
    try {

        const result = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                folders: {
                    include: {
                        notes: true,
                    }
                }
            }
        })

        // ユーザーが見つからない場合
        if (!result) {
            return {
                success: false,
                message: "User not found",
                data: null,
            }
        }

        console.log("Prismaから取得したユーザーデータ:", result);

        return {
            success: true,
            message: "User actions fetched successfully",
            data: result,
        }
    } catch(error) {
        console.error("getUserActions エラー:", error);
        return {
            success: false,
            message: "Failed to get user actions",
            data: null,
            error: error,
        }
    }
}