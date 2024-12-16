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
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={`${inter.className} flex flex-col md:flex-row min-h-screen bg-gray-100`}>
        {/* Toolbar on the left, takes fixed width on medium screens and up */}
        <Toolbar />
        {/* Main content area, flex grow and takes remaining space */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {children}
          </div>

        </main>
      </body>
    </html>
  )
}
