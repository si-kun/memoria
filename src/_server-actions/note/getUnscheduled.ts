"use server"

import { prisma } from "@/utils/prisma/prismaClient"

export const getUnscheduled = async(userId: string) => {
  try {
    const unscheduledNotes = await prisma.note.findMany({
        where: {
            userId,
            unScheduled: true,
        },
        orderBy: {
            createdAt: "desc",
        }
    })


    return {
        success: true,
        data: unscheduledNotes,
    }
  } catch {
    return {
        success: false,
        error: "ノートの取得に失敗しました",
    }
  }
}