import {
  allNoteAtom,
  comingUpNoteAtom,
  favoriteNoteAtom,
  folderAtom,
  tagsAtom,
  todayNoteAtom,
  trashNoteAtom,
  unscheduledNoteAtom,
} from "@/atom/noteAtom";
import { userAtom } from "@/atom/userAtom";
import { useAtomValue, useSetAtom } from "jotai";

import { getTodayNotes } from "@/_server-actions/note/getTodayNotes";
import { getComingupNotes } from "@/_server-actions/note/getComingupNotes";
import { getFolder } from "@/_server-actions/getFolder";
import { getUnscheduled } from "@/_server-actions/note/getUnscheduled";
import { getAllNote } from "@/_server-actions/getAllNote";
import { useEffect } from "react";
import { getTags } from "@/_server-actions/getTags";
import { FolderWithCount, TagWithCount } from "@/types";
import { getFavorite } from "@/_server-actions/note/getFavorite";
import { Note } from "@prisma/client";
import { getNoteTrash } from "@/_server-actions/note/getTrashNote";

export const useFetchNotes = () => {
  const user = useAtomValue(userAtom);
  const setNotes = useSetAtom(allNoteAtom);
  const setTodayNotes = useSetAtom(todayNoteAtom);
  const setComingUpNotes = useSetAtom(comingUpNoteAtom);
  const setUnscheduledNotes = useSetAtom(unscheduledNoteAtom);
  const setTrashNotes = useSetAtom(trashNoteAtom);
  const setFavorites = useSetAtom(favoriteNoteAtom);
  const setFolder = useSetAtom(folderAtom);
  const setTags = useSetAtom(tagsAtom);

  const fetchData = async () => {
    if (!user?.id) return;

    const userId = user.id;

    const result = await Promise.allSettled([
      getAllNote(userId),
      getTodayNotes(userId),
      getComingupNotes(userId),
      getUnscheduled(userId),
      getFavorite(userId),
      getNoteTrash(userId),
      getFolder(userId),
      getTags(userId),
    ]);

    const labels = [
      "allNotes",
      "todayNotes",
      "comingUpNotes",
      "unscheduledNotes",
      "favorites",
      "trashNotes",
      "folder",
      "tags",
    ] as const;

    result.forEach((res, index) => {
      const label = labels[index];

      if (res.status === "fulfilled") {
        const data = res.value.data || [];
        switch (label) {
          case "allNotes":
            setNotes(data as Note[]);
            break;
          case "todayNotes":
            setTodayNotes(data as Note[]);
            break;
          case "comingUpNotes":
            setComingUpNotes(data as Note[]);
            break;
          case "unscheduledNotes":
            setUnscheduledNotes(data as Note[]);
            break;
          case "favorites":
            setFavorites(data as Note[]);
            break;
          case "trashNotes":
            setTrashNotes(data as Note[]);
            break;
          case "folder":
            setFolder(data as FolderWithCount[]);
            break;
          case "tags":
            setTags(data as TagWithCount[]);
            break;
          default:
            const _exhaustiveCheck: never = label;
            throw new Error(`${_exhaustiveCheck}は存在しません`);
        }
      } else {
        console.error(`${label}→失敗`, res.reason);
      }
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { refetchNotes: fetchData };
};
