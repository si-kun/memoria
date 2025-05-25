import { getNoteDetail } from "@/_server-actions/note/getNoteDetail";
import NoteForm from "@/components/formContents/NoteForm";

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;
  const slugParts = slug.split("-");
  const noteId = slugParts.slice(-5).join("-");

  const result = await getNoteDetail(noteId);

  if (!result.success || !result.data) {
    return <div>Note not found</div>;
  }

  console.log(result.data.tags)
  console.log("result.data全体の構造:", JSON.stringify(result.data, null, 2));
console.log("tagsの型:", typeof result.data.tags);
console.log("tagsはArray?:", Array.isArray(result.data.tags));
console.log("tags各要素の型:", result.data.tags.map(t => typeof t));
console.log("tags各要素の詳細:", result.data.tags.map(t => ({ value: t, type: typeof t, keys: Object.keys(t) })));

console.log(result.data.tags)

  return (
    <NoteForm
      defaultValues={{
        ...result.data,
        tags: result.data.tags
      }}
      isEdit={true}
    />
  );
}
