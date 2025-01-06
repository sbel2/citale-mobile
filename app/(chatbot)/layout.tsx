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
        <style>
          {`
            .full-viewport-height {
              height: 100vh;
            }

            @supports (height: 100dvh) {
              .full-viewport-height {
                height: 100dvh;
              }
            }
          `}
        </style>
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-100`}>
        <div className="hidden lg:block">
          <Toolbar />
        </div>
        <main className="flex-1 flex flex-col overflow-hidden full-viewport-height">
          <div className="overflow-hidden">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
