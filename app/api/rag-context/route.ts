// import { NextResponse } from "next/server";
// import { createClient } from "@/supabase/client";
// import { ragChat } from "@/app/lib/rag-chat";

// export async function GET() {
//   try {
//     // Fetch data from the database
//     const supabase = createClient();
//     const { data, error } = await supabase
//       .from("posts")
//       .select("title, description, category, created_at");

//     if (error) {
//       console.error("Error fetching data:", error.message);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     // Add data to RAGChat context
//     if (data && data.length > 0) {
//       for (const post of data) {
//         await ragChat.context.add({
//           type: "text",
//           data: `Title: ${post.title}\nDescription: ${post.description}\nCategory: ${post.category}\nDate: ${post.created_at}`,
//         });
//       }
//     }

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("Unexpected error:", err);
//     return NextResponse.json({ error: "Unexpected error occurred." }, { status: 500 });
//   }
// }
