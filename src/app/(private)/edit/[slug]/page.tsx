import { getNoteDetail } from "@/_server-actions/note/getNoteDetail";
import NoteForm from "@/components/formContents/NoteForm";
// import { cookies } from "next/headers";

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // cookies();

  const { slug } = await params;
  const slugParts = slug.split("-");
  const noteId = slugParts.slice(-5).join("-");

  const result = await getNoteDetail(noteId);

  if (!result.success || !result.data) {
    return <div>Note not found</div>;
  }

  return (
    <NoteForm
      defaultValues={{
        ...result.data,
        tags: result.data.tags.map((tag) => tag.name),
      }}
    />
  );
}
