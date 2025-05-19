"use server"

import { prisma } from "@/utils/prisma/prismaClient"
import { endOfDay } from "date-fns"

export const getComingupNotes = async(userId: string) => {
    try {
        const comingUpNotes = await prisma.note.findMany({
            where: {
                userId,
                unScheduled: false,
                startDate: {
                    gte: endOfDay(new Date())
                }
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