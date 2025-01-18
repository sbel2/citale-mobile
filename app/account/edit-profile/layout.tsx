import '../../globals.css';
import { Inter } from "next/font/google";
import Toolbar from "@/components/toolbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: 'Citale | Profile',
    description: 'Profile Page',
  }
  
  export default function EProfileLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body className={`${inter.className} bg-white`}>
        <div>
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
  