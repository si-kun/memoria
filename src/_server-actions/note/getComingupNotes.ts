"use server"

import { prisma } from "@/utils/prisma/prismaClient"
import { endOfDay, startOfDay } from "date-fns"

export const getComingupNotes = async(userId: string) => {
    try {
        const comingUpNotes = await prisma.note.findMany({
            where: {
                userId,
                unScheduled: false,
                deletedAt: null,
                OR: [

                    {
                        startDate: {
                            gte: endOfDay(new Date())
                        },
                    },
                    {
                        endDate: {
                            lt: startOfDay(new Date())
                        }
                    },
                    // 完了していないノート スキーマに追加する
                    // isCompleted: false
                ]
            }
        })

        return {
            success: true,
            data: comingUpNotes
        }
    } catch(error) {
        return {
            success: false,
            error: error
        }
    }
}