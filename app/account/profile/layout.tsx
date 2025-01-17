import '../../globals.css';
import { Inter } from "next/font/google";
import Toolbar from "@/components/toolbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: 'Citale | Profile',
    description: 'Profile Page',
  }
  
  export default function ProfileLayout({
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
  