import '../globals.css';
import Toolbar from "@/components/toolbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Citale | Talebot',
  description: 'Recommendation bot',
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} bg-gray-100 flex h-[calc(100dvh-56px)] `}>
      {/* Toolbar - hidden on small screens, visible on large screens */}
      <div className="hidden lg:block w-64">
        <Toolbar />
      </div>

      {/* Main content area */}
      <main className="flex-1 flex justify-center">
        {/* Center content on the right side of the screen */}
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
