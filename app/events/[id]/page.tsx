import PostComponent from "@/components/postComponent_new";
import { createClient } from "@/supabase/client";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const { id: post_id } = params;
  const supabase = createClient();
  const { data: postData, error } = await supabase
    .from("posts")
    .select()
    .match({ post_id })
    .single();

  if (!postData) {
    notFound();
  }
  return (
    <div>
      <PostComponent {...postData} />
    </div>
  );
}
