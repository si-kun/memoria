import { moveToTrashNote } from "@/_server-actions/note/moveToTrashNote";
import { useFetchNotes } from "./useFetchNotes";
import toast from "react-hot-toast";
import { deleteNote } from "@/_server-actions/note/deleteNote";
import { Note } from "@prisma/client";
import { useEffect, useState } from "react";
import { useDialogTrigger } from "./useDialogTrigger";
import { moveToManyTrashNote } from "@/_server-actions/note/moveToManyTrashNote";
import { useMoreDialog } from "./useMoreDialog";

export interface SelectedCard  {id: string, title: string}

export function useTrashNote() {
  const { refetchNotes } = useFetchNotes();
  const { setMoreDialog } = useMoreDialog();


  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedCard, setSelectedCard] = useState<SelectedCard[]>([]);


  const {setCardDialog} = useDialogTrigger()

  useEffect(() => {
    console.log("selectedCard 最新:", selectedCard);
    console.log("selectedNote 最新:", selectedNote);
  }, [selectedCard,selectedNote]);

  const handleSelectCard = (note: Note) => {
    if (selectedCard.some((card) => card.id === note.id)) {
      setSelectedCard((prev) => prev.filter((card) => card.id !== note.id));
    } else {
      setSelectedCard((prev) => [...prev, { id: note.id, title: note.title }]);
    }
    console.log(selectedCard)
  };

  // const handleMoveToTrash = async (id: string) => {
  //   // ゴミ箱移動API
  //   const result = await moveToTrashNote(id);
  
  //   if (result.success) {
  //     // 削除前か復元かでメッセージ出し分け
  //     if (selectedNote?.deletedAt === null) {
  //       toast.success(`${selectedNote?.title}をゴミ箱に移動しました`);
  //     } else {
  //       toast.success(`${selectedNote?.title}を復元しました`);
  //     }
  
  //     // 選択中リストから削除idを除外
  //     setSelectedCard((prev) => prev.filter((card) => card.id !== id));
  
  //     // ダイアログを閉じる
  //     setCardDialog(false);
  
  //     // ノート一覧を再取得（stateが最新に）
  //     refetchNotes();
  
  //     // Dialog閉じアニメ後に詳細選択も解除（200msはshadcn/Dialogのデフォアニメ）
  //     setTimeout(() => {
  //       setSelectedNote(null);
  //       console.log(selectedCard)
  //     }, 200);
  
  //   } else {
  //     toast.error(result.error as string);
  //     console.error(result.error);
  //   }
  // };

  const handleMoveToTrash = async (id: string) => {
    // ゴミ箱移動API
    const result = await moveToTrashNote(id);
  
    if (result.success) {
      // 削除前か復元かでメッセージ出し分け
      if (selectedNote?.deletedAt === null) {
        toast.success(`${selectedNote?.title}をゴミ箱に移動しました`);
      } else {
        toast.success(`${selectedNote?.title}を復元しました`);
      }
  
      // ダイアログを閉じる
      setCardDialog(false);
  
      // ノート一覧を再取得（stateが最新に）
      refetchNotes();
  
      // 詳細選択も即座に解除
      setSelectedNote(null);
  
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
        setSelectedNote(null);
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
    selectedNote,
    setSelectedNote,
    selectedCard,
    setSelectedCard,
    handleMoveToTrash,
    handleMoveToManyTrashNote,
    handleDeleteCard,
  };
}
