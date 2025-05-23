"use server";

import { prisma } from "@/utils/prisma/prismaClient";
import { endOfDay, startOfDay } from "date-fns";

export const getTodayNotes = async (userId: string) => {
  try {
    const toDayNotes = await prisma.note.findMany({
      where: {
        userId,
        unScheduled: false,
        startDate: {
          gte: startOfDay(new Date()),
          lte: endOfDay(new Date()),
        },
        public: true,
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
