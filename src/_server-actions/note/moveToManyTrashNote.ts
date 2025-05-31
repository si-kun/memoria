"use server";

import { prisma } from "@/utils/prisma/prismaClient";

export const moveToManyTrashNote = async (ids: string[]) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (notes.length === 0) {
      return {
        success: false,
        message: "ノートが見つかりませんでした",
      };
    }

    const moveCount = notes.length;

    const updatePromises = await Promise.all(
      notes.map((note) =>
        prisma.note.update({
          where: { id: note.id },
          data: {
            deletedAt: note.deletedAt !== null ? null : new Date(),
          },
        })
      )
    );

    const isTrash = notes.every(note => note.deletedAt !== null);

    return {
      success: true,
      data: updatePromises,
      message: !isTrash
        ? `${moveCount}件のノートをゴミ箱に移動しました`
        : `${moveCount}件のノートを復元しました`,
    };
  } catch (error) {
    console.error("Failed to move notes to trash", error);
    return {
      success: false,
      error: "ノートをゴミ箱に移動できませんでした",
    };
  }
};
