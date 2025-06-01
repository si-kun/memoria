"use server";

import { prisma } from "@/utils/prisma/prismaClient";
import { endOfDay, startOfDay } from "date-fns";

export const getTodayNotes = async (userId: string) => {
  try {
    const toDayNotes = await prisma.note.findMany({
      where: {
        userId,
        isUnscheduled: false,
        deletedAt: null,
        startDate: {
          gte: startOfDay(new Date()),
          lte: endOfDay(new Date()),
        },
        isPublic: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: toDayNotes,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
};
