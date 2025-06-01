import { moveToTrashNote } from "@/_server-actions/note/moveToTrashNote";
import { useFetchNotes } from "./useFetchNotes";
import toast from "react-hot-toast";
import { deleteNote } from "@/_server-actions/note/deleteNote";
import { Note } from "@prisma/client";
import { useState } from "react";
import { useDialogTrigger } from "./useDialogTrigger";
import { moveToManyTrashNote } from "@/_server-actions/note/moveToManyTrashNote";
import { useMoreDialog } from "./useMoreDialog";
import { useAtom } from "jotai";
import { dialogNoteAtom } from "@/atom/noteAtom";

export interface SelectedCard  {id: string, title: string}

export function useTrashNote() {
  const { refetchNotes } = useFetchNotes();
  const { setMoreDialog } = useMoreDialog();


  const [dialogNote, setDialogNote] = useAtom(dialogNoteAtom);
  const [selectedCard, setSelectedCard] = useState<SelectedCard[]>([]);


  const {setCardDialog} = useDialogTrigger()

  const handleSelectCard = (note: Note) => {
    if (selectedCard.some((card) => card.id === note.id)) {
      setSelectedCard((prev) => prev.filter((card) => card.id !== note.id));
    } else {
      setSelectedCard((prev) => [...prev, { id: note.id, title: note.title }]);
    }
    console.log(selectedCard)
  };

  const handleMoveToTrash = async (id: string) => {
    // ゴミ箱移動API
    const result = await moveToTrashNote(id);
  
    if (result.success) {
      // 削除前か復元かでメッセージ出し分け
      if (dialogNote?.deletedAt === null) {
        toast.success(`${dialogNote?.title}をゴミ箱に移動しました`);
      } else {
        toast.success(`${dialogNote?.title}を復元しました`);
      }
  
      // ダイアログを閉じる
      setCardDialog(false);
  
      // ノート一覧を再取得（stateが最新に）
      refetchNotes();
  
      // 詳細選択も即座に解除
      setDialogNote(null);
  
    } else {
      toast.error(result.error as string);
      console.error(result.error);
    }
  };

  const handleMoveToManyTrashNote = async () => {
    const res = await moveToManyTrashNote(selectedCard.map((card: SelectedCard) => card.id));

    if (res.success) {
      toast.success(res.message as string);
      setSelectedCard([]);
      setMoreDialog(false);
      refetchNotes();
    } else {
      toast.error(res.error as string);
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      const result = await deleteNote(id);
      if (result.success) {
        toast.success("ノートを削除しました");
        setDialogNote(null);
        refetchNotes();
      }
    } catch (error) {
      console.error("Failed to delete note", error);
      toast.error("ノートの削除に失敗しました");
      refetchNotes();
    }
  };

  return {
    handleSelectCard,
    selectedCard,
    setSelectedCard,
    handleMoveToTrash,
    handleMoveToManyTrashNote,
    handleDeleteCard,
  };
}
