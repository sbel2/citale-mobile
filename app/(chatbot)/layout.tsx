import '../globals.css';
import Toolbar from "@/components/toolbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Citale | Talebot',
  description: 'recommendation bot',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <div className="hidden lg:block">
          <Toolbar />
        </div>
        <main>
          <div>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
