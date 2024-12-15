import '../globals.css';
import Toolbar from "@/components/toolbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Citale | talebot',
  description: 'recommendation bot',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col md:flex-row`}>
        {/* Toolbar on the left */}
        <Toolbar />
          <main className="flex-1 p-4 bg-gray-951">
            {children}
          </main>
      </body>
    </html>
  )
}
