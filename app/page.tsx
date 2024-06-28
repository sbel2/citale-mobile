import Card from "@/components/card";
import { createClient } from "@/supabase/client";
import { cookies } from "next/headers";
import Image from "next/legacy/image";


export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient();

  const { data: post, error } = await supabase.from("posts").select();

  if (!post) {
    return <p>Not Found </p>;
  }
  return (
    <main className="min-h-screen mx-auto max-w-[100rem] overflow-x-hidden">
      <div className="px-12 pb-20">
        <div className="flex flex-col xl:flex-row xl:gap-40">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {post.map((post) => (
              <Card key={post.post_id} {...post} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}