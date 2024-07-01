import Card from "@/components/card";
import { createClient } from "@/supabase/client";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient();

  const { data: posts, error } = await supabase.from("posts").select();

  if (error) {
    return <p>Error loading posts</p>;
  }

  if (!posts || posts.length === 0) {
    return <p>No posts found</p>;
  }

  return (
    <main className="min-h-screen mx-auto max-w-[100rem] overflow-x-hidden">
      <div className="px-12 pb-20">
        <div className="flex flex-col xl:flex-row xl:gap-40 border-radius:10px">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {posts.map((post) => (
              <Card 
                key={post.post_id.toString()} // Convert post_id to string if it is a number
                post_id={post.post_id.toString()} // Ensure post_id is passed as a string
                title={post.title}
                description={post.description}
                imageUrl={post.imageUrl} // Ensure imageUrl is an array of strings
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
