import Toolbar from "@/components/toolbar"; 
import { Inter } from "next/font/google";
import '../globals.css';
import Script from 'next/script';
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Citale | Posting",
  description: "Things to do in Boston",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes = "any"/>
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${inter.className} flex flex-col md:flex-row`}>
        {/* Toolbar on the left */}
        <Toolbar />

        {/* Group Header and Main Content */}
        <div className="flex-1 flex flex-col md:ml-64">
          <main className="flex-1 p-4 bg-gray-951">
            {children}
          </main>
        </div>
      </body>

    </html>
  );
}
