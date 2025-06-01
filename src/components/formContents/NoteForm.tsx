"use client";

import React, { useMemo } from "react";
import { FormProvider, Path, PathValue, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import FormTagInput from "./FormTagInput";
import { Card } from "../ui/card";
import FormUnsheduled from "./FormUnsheduled";
import FormDatePiceker from "./FormDatePiceker";
import FormFoldersSelect from "./FormFoldersSelect";
import PublicCheck from "../checkbox/PublicCheck";
import NoteSubmitButton from "../button/NoteSubmitButton";
import { useAtomValue } from "jotai";
import { folderAtom } from "@/atom/noteAtom";
import Editor from "../editor/Editor";
import { NoteData } from "@/types";
import { userAtom } from "@/atom/userAtom";
import { updateNote } from "@/_server-actions/note/updateNote";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addNewNoteActions } from "@/_server-actions/addNewNoteActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema } from "@/shema/noteSchema";
import { Star } from "lucide-react";
import { Button } from "../ui/button";

interface NoteFormProps {
  defaultValues: NoteData;
  isEdit?: boolean;
}

const NoteForm = ({ defaultValues, isEdit }: NoteFormProps) => {
  console.log(defaultValues);
  const folders = useAtomValue(folderAtom);

  const initialValues = useMemo(() => {
    const matched = folders.find(
      (f) => f.folderName === defaultValues.folderName
    );
    return {
      ...defaultValues,
      selectedFolder: matched?.id || "",
    };
  }, [defaultValues, folders]);

  const methods = useForm<NoteData, any, NoteData>({
    resolver: zodResolver(noteSchema),
    defaultValues: initialValues,
  });

  const router = useRouter();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  const user = useAtomValue(userAtom);
  const userId = user?.id;

  const isUnscheduled = watch("isUnscheduled");

  const handleToggleChange = <K extends Path<NoteData>>(key: K) => {
    const current = watch(key) as boolean;
    setValue(key, !current as PathValue<NoteData, K>);
  };

  const onSubmit = async (data: NoteData) => {
    if (isUnscheduled) {
      data.startDate = null;
      data.endDate = null;
    }

    const { selectedFolder, newFolder, ...dbData } = data;
    // selectedFolder, newFolder を使わないなら Lint 対策で明示破棄
    void selectedFolder;
    void newFolder;

    if (isEdit) {
      // 更新処理
      if (userId) {
        const result = await updateNote(dbData, userId);
        if (result.success) {
          console.log(result);
          toast.success(result.message || "更新に成功しました");
          router.replace("/");
        } else {
          toast.error(result.message || "更新に失敗しました");
        }
      }
    } else {
      // 新規作成処理
      if (userId) {
        const result = await addNewNoteActions(dbData, userId);
        if (result.success) {
          console.log(result);
          toast.success(result.message || "新規ノートの作成に成功しました");
          router.replace("/");
        } else {
          toast.error(result.message || "新規ノートの作成に失敗しました");
        }
      }
    }
  };

  // バリデーションエラーをキャッチする関数を追加
  const onError = (errors: any) => {
    console.log("バリデーションエラーが発生しました:", errors);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="w-full h-screen flex gap-10 overflow-hidden p-10 pb-30"
      >
        {/* 左コンテンツ */}
        <div className="w-1/2 flex flex-col gap-4">
          <Input
            placeholder="New Note Title"
            className="shadow-sm focus:ring-2 ring-indigo-400"
            {...register("title")}
          />
          <FormTagInput defaultValues={defaultValues.tags} />
          <Card className="flex flex-col gap-2 mt-4 p-4 space-y-2">
            <FormUnsheduled
              checked={watch("isUnscheduled")}
              onChange={() => handleToggleChange("isUnscheduled")}
            />
            <div className="flex gap-2">
              <FormDatePiceker
                title="Start"
                selectedDate={watch("startDate")}
                setSelectedDate={(date) =>
                  setValue("startDate", date ?? watch("startDate"))
                }
                disabled={watch("isUnscheduled")}
              />
              <FormDatePiceker
                title="End"
                selectedDate={watch("endDate")}
                setSelectedDate={(date) =>
                  setValue("endDate", date ?? watch("endDate"))
                }
                disabled={watch("isUnscheduled")}
              />
            </div>
            <FormFoldersSelect />
          </Card>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => handleToggleChange("isFavorite")}
              className={`${
                watch("isFavorite")
                  ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-50"
                  : ""
              } transition-all duration-300`}
            >
              <Star
                className={`${
                  watch("isFavorite")
                    ? "text-yellow-500 bg-yellow-50"
                    : ""
                }`}
              />
              <span className={`${watch("isFavorite") ? "fill-yellow-500" : ""}`}>
                {watch("isFavorite") ? "Favorite" : "Unfavorite"}
              </span>
            </Button>

            <div className="ml-auto flex items-center gap-2">
              <PublicCheck
                checked={watch("isPublic")}
                onChange={() => handleToggleChange("isPublic")}
              />
              <NoteSubmitButton />
            </div>
          </div>

          {errors.title || errors.content ? (
            <div>
              <p className="text-red-500 font-bold">入力エラーがあります</p>
              <ul className="list-disc list-inside text-red-500">
                {errors.title && <li>{errors.title.message}</li>}
                {errors.content && <li>{errors.content.message}</li>}
                {errors.folderName && <li>{errors.folderName.message}</li>}
              </ul>
            </div>
          ) : null}
        </div>
        {/* 右コンテンツ */}
        <div className="w-1/2 h-full bg-gray-50 rounded-md p-4 shadow-md overflow-hidden flex-1 flex flex-col">
          <Editor
            markdown={watch("content")}
            onChange={(markdown) =>
              setValue("content", markdown, { shouldValidate: true })
            }
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default NoteForm;
