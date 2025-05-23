"use client";

import React, { useEffect, useState } from "react";
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
import { NoteDataUpdate } from "@/types";
import { userAtom } from "@/atom/userAtom";
import { updateNote } from "@/_server-actions/note/updateNote";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface NoteFormProps {
  defaultValues: NoteDataUpdate;
}

const NoteForm = ({ defaultValues }: NoteFormProps) => {
  const methods = useForm<NoteDataUpdate>({
    defaultValues: defaultValues,
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

  const [newFolder, setNewFolder] = useState<string>("");
  const [selectFolder, setSelectFolder] = useState<string | undefined>("");

  useEffect(() => {
    if (folders.length > 0 && defaultValues.folderName) {
      const matched = folders.find(
        (f) => f.folderName === defaultValues.folderName
      );
      if (matched) {
        setNewFolder(matched.folderName);
      }
    }
  }, [folders, defaultValues.folderName]);

  const unScheduled = watch("unScheduled");

  const handleToggleChange = <K extends Path<NoteDataUpdate>>(key: K) => {
    const current = watch(key) as boolean;
    setValue(key, !current as PathValue<NoteDataUpdate, K>);
  };

  if (folders.length === 0) {
    return <div>Loading folders...</div>;
  }

  const handleUpdate = async (data: NoteDataUpdate) => {

    const selectedFolderName = folders.find(folder => folder.id === selectFolder)?.folderName
    const submitFolder = newFolder !== "" ? newFolder : selectedFolderName;

    if (userId) {
      const updateNoteData = {
        ...data,
        folderName: submitFolder,
      };

      console.log(updateNoteData);

      const result = await updateNote(updateNoteData, userId);
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
        onSubmit={handleSubmit(handleUpdate)}
        className="w-full h-screen flex gap-10 overflow-hidden p-10 pb-30"
      >
        {/* 左コンテンツ */}
        <div className="w-1/2 flex flex-col gap-4">
          <Input
            placeholder="New Note Title"
            className="shadow-sm focus:ring-2 ring-indigo-400"
            {...register("title")}
          />
          <FormTagInput
            defaultValues={defaultValues.tags}
          />
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
            <FormFoldersSelect
              newFolder={newFolder}
              setNewFolder={setNewFolder}
              selectFolder={selectFolder}
              setSelectFolder={setSelectFolder}
            />
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
