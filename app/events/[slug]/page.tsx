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

// export async function getStaticPaths() {
//   const supabase = createClient();
//   const { data: events, error } = await supabase.from("cueup-events").select();

//   if (error) {
//     console.error("Error fetching event slugs:", error);
//     return { paths: [], fallback: "blocking" };
//   }

//   const paths = events.map((event) => ({
//     params: { slug: event.id },
//   }));

//   return { paths, fallback: "blocking" };
// }

// export async function getStaticProps({ params }: { params: { slug: string } }) {
//   const supabase = createClient();
//   const { slug } = params;
//   const { data: eventData, error } = await supabase
//     .from("cueup-events")
//     .select()
//     .match({ id: slug })
//     .single();

//   if (error) {
//     console.error("Error fetching event data:", error);
//     return { notFound: true };
//   }

//   return {
//     props: {
//       eventData,
//     },
//     revalidate: 3600, // Revalidate the page at most once every hour
//   };
// }

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
