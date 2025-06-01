"use client";

import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-datepicker/dist/react-datepicker.css";

import { NoteData } from "@/types";
import NoteForm from "@/components/formContents/NoteForm";
import { useForm } from "react-hook-form";
import { noteSchema } from "@/shema/noteSchema";


const AddNotePage = () => {

  const methods = useForm<NoteData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      id: uuidv4(),
      title: "",
      content: "",
      tags: [],
      isUnscheduled: false,
      startDate: new Date() || null,
      endDate: new Date() || null,
      folderName: "",
      isPublic: true,
    },
  });

  return <NoteForm defaultValues={methods.getValues()} />;
};

export default AddNotePage;
