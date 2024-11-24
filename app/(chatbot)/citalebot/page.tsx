import { Chat } from "@/components/chatbot";
import { cookies } from "next/headers";
import { ragChat } from "@/app/lib/rag-chat";
import { GET } from "@/app/api/rag-context/route";


export default async function Home() {
  const response = await GET();
  const result = await response.json();

  if (result.error) {
    console.error("Error initializing RAGChat context:", result.error);
    return <p>Error: {result.error}</p>;
  }

  console.log("RAGChat context initialized successfully.");
  
  // Retrieve the session ID from cookies (middleware guarantees it exists)
  const sessionId = cookies().get("sessionId")?.value!;

  // Fetch initial messages for the session
  const initialMessages = await ragChat.history.getMessages({
    amount: 5,
    sessionId,
  });

  // Render the Chat component with session ID and initial messages
  return <Chat sessionId={sessionId} initialMessages={initialMessages} />;
}
