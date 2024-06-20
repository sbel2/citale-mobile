import Card from "@/components/card";
import { createClient } from "@/supabase/client";
import { cookies } from "next/headers";
import Image from "next/legacy/image";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient();

  const { data: events, error } = await supabase.from("cueup-events").select();

  if (!events) {
    return <p>Not Found </p>;
  }
  return (
    <main className="min-h-screen mx-auto max-w-[100rem]">
      <div className="px-12 pt-12 pb-20">
        <div className="flex flex-col xl:flex-row xl: gap-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-12"></div>
          {events.map((event) => (
            <Card key={event.id} {...event} />
          ))}
        </div>
      </div>
    </main>
  );
}
