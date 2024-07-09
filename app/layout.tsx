import Header from "@/components/header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HotjarInit from './HotjarInit';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Citale",
  description: "Things to do in Boston",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HotjarInit />
        <Header />
        <div className="bg-gray-951">{children}</div>
      </body>
    </html>
  );
}