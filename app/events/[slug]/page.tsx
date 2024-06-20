import PostComponent from "@/components/postComponent";
import { createClient } from "@/supabase/client";
import { notFound } from "next/navigation";

interface EventData {
  id: number;
  title: string;
  description: string;
  imageUrl: string[];
}

async function fetchEventData(slug: string): Promise<EventData | null> {
  const supabase = createClient();
  const { data: eventData, error } = await supabase
    .from("cueup-events")
    .select()
    .match({ id: slug })
    .single();

  if (error) {
    console.error("Error fetching event data:", error);
    return null;
  }

  return eventData;
}

export async function generateStaticParams() {
  const supabase = createClient();
  const { data: events, error } = await supabase.from("cueup-events").select();

  if (error) {
    console.error("Error fetching event slugs:", error);
    return [];
  }

  return events.map((event) => ({
    slug: event.id,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const eventData = await fetchEventData(slug);

  if (!eventData) {
    notFound();
  }
  return (
    <div>
      <PostComponent eventData={eventData} />
    </div>
  );
}
