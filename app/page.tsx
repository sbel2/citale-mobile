import Card from "@/components/card";
//import { createClient } from "@/supabase/client";
import Image from "next/image";

export default async function Home() {
  const events = [
    {
      id: 0,
      title:
        "Where to go this weekend | come to Boston Seaport Summer Market ☘️",
      description: `The Seaport Summer Market will be returning for the third year! You can visit from 05/11 until 09/22 on the weekends from 11 am to 7 pm 🤠

      Enjoy artisan grilled cheese sandwiches 🥪 from Cheese Louise, empanadas from Bocadillos, cuisine from the Caribbeans at ZaZ, and hard cider 🍷 from Downeast.
      
      You can also support local vendors at the Makers Show. From vintage clothing and jewelry to caucuses 🌵, browse through the 80 stalls at the market to find your next obsession!
      
      📍88 Seaport Boulevard, right next to Warby Parker
      
      📅 May 11th - Sep 22nd
      
      🚇 take the subway to State stop, and walk for 15-20 minutes
      
      🔗 https://www.bostonseaport.xyz/venue/seaport-summer-market-2/`,

      imageUrl:
        "https://qteefmlwxyvxjvehgjvp.supabase.co/storage/v1/object/public/images/e1_1.jpeg",
    },
  ]; // Dummy data. Have to replace with the backend data
  //const supabase = createClient();
  //const { data: events, error } = await supabase.from("cueup-events").select();

  //console.log(events); // TODO : Make sure after fetching the data, the events are logged
  //console.log(error);
  // if (!events) {
  //   return <p>Not Found </p>;
  // }
  return (
    <main className="min-h-screen mx-auto max-w-[100rem]">
      <div className="px-12 pt-12 pb-20">
        <div className="flex flex-col xl:flex-row xl: gap-40">
          <div className="pt-12">
            <h2 className="text-4xl mb-16">Upcoming Events 🔥</h2>
            <p className="text-xl">Watch out for these amazing Events 🌃</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-12"></div>
          {events.map((event) => (
            <Card
              key={event.id}
              {...event}
              //imageUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${event.imageUrl}`}
            />
          ))}
        </div>
        <h2 className="text-4xl mt-20 mb-16">All Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 1g:grid-cols-3 xl:grid-cols-4 gap-8"></div>
        {events.map((event) => (
          <Card
            key={event.id}
            {...event}
            //imageUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${event.imageUrl}`}
          />
        ))}
      </div>
    </main>
  );
}
