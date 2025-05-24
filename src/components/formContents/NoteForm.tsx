"use client";

import React, { useEffect } from "react";
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

interface NoteFormProps {
  defaultValues: NoteData;
  isEdit?: boolean;
}

const NoteForm = ({ defaultValues, isEdit }: NoteFormProps) => {
  const methods = useForm<NoteData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      ...defaultValues,
      selectedFolder: ""
    }
  });

  const router = useRouter();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  const folders = useAtomValue(folderAtom);
  const user = useAtomValue(userAtom);
  const userId = user?.id;

  useEffect(() => {
    console.log(defaultValues.folderName);

    const matched = folders.find((f) => f.folderName === defaultValues.folderName)

    setValue("newFolder", defaultValues.folderName);

    if (matched) {
      setValue("selectedFolder", matched.id);
    }
  }, [defaultValues.folderName, folders, setValue]);
  const unScheduled = watch("unScheduled");

  const handleToggleChange = <K extends Path<NoteData>>(key: K) => {
    const current = watch(key) as boolean;
    setValue(key, !current as PathValue<NoteData, K>);
  };

  if (folders.length === 0) {
    return <div>Loading folders...</div>;
  }

  const handleAddNote = async (data: NoteData) => {

    if (userId) {
      const result = await addNewNoteActions(data, userId);
      console.log(result);

      if (result.success) {
        toast.success(result.message || "新規ノートの作成に成功しました");
        router.replace("/");
      } else {
        toast.error(result.message || "新規ノートの作成に失敗しました");
      }
    }
  };

  const handleUpdate = async (data: NoteData) => {

    if (userId) {
      const result = await updateNote(data, userId);
      if (result.success) {
        toast.success(result.message || "更新に成功しました");
        router.replace("/");
      } else {
        toast.error(result.message || "更新に失敗しました");
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(isEdit ? handleUpdate : handleAddNote)}
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
              checked={unScheduled}
              onChange={() => handleToggleChange("unScheduled")}
            />
            <div className="flex gap-2">
              <FormDatePiceker
                title="Start"
                selectedDate={watch("startDate")}
                setSelectedDate={(date) =>
                  setValue("startDate", date ?? watch("startDate"))
                }
                disabled={unScheduled}
              />
              <FormDatePiceker
                title="End"
                selectedDate={watch("endDate")}
                setSelectedDate={(date) =>
                  setValue("endDate", date ?? watch("endDate"))
                }
                disabled={unScheduled}
              />
            </div>
            <FormFoldersSelect />
          </Card>
          <div className="flex items-center justify-end gap-5">
            <PublicCheck
              checked={watch("public")}
              onChange={() => handleToggleChange("public")}
            />
            <NoteSubmitButton />
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
