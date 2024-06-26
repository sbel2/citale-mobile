import PostComponent from "@/components/postComponent";
import { createClient } from "@/supabase/client";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createClient();
  const { data: eventData, error } = await supabase
    .from("cueup-events")
    .select()
    .match({ id })
    .single();

  if (!eventData) {
    notFound();
  }
  return (
    <div>
      <PostComponent {...eventData} />
    </div>
  );
}
