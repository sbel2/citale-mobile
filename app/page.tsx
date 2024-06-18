import Card from "@/components/card";
import Image from "next/image";

export default function Home() {
  const events = [
    {
      id: 0,
      name: "Where to go this weekend | come to Boston Seaport Summer Market",
      description:
        "The Seaport Summer Market will be returning for the third year! You can visit from 05/11 until 09/22 on the weekends from 11 am to 7 pm 🤠 Enjoy artisan grilled cheese sandwiches 🥪 from Cheese Louise, empanadas from Bocadillos, cuisine from the Caribbeans at ZaZ, and hard cider 🍷 from Downeast. You can also support local vendors at the Makers Show. From vintage clothing and jewelry to caucuses 🌵, browse through the 80 stalls at the market to find your next obsession!📍88 Seaport Boulevard, right next to Warby Parker 📅 May 11th - Sep 22nd 🚇 take the subway to State stop, and walk for 15-20 minutes",
      imageUrl:
        "https://prod-files-secure.s3.us-west-2.amazonaws.com/6816f889-5e57-485b-ab46-d40ad54d54f4/a314acf3-c5eb-4beb-b8f8-77d301d6138e/seaport1.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240618%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240618T050003Z&X-Amz-Expires=3600&X-Amz-Signature=45f38f0ecbd437298e6480f649ca5e3cf7f7ef2cb6a69db74bb460c38dad4e9e&X-Amz-SignedHeaders=host&x-id=GetObject",
    },
  ];
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
            <Card key={`${event.name} - ${event.id}`} {...event} />
          ))}
        </div>
        <h2 className="text-4xl mt-20 mb-16">All Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 1g:grid-cols-3 xl:grid-cols-4 gap-8"></div>
        {events.map((event) => (
          <Card key={event.id} {...event} />
        ))}
      </div>
    </main>
  );
}
