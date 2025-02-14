import Header from "@/components/header";
import Toolbar from "@/components/toolbar"; 
import { Inter } from "next/font/google";
import '../globals.css';

import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Citale | Explore Boston",
  description: "Things to do in Boston",
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} flex flex-col md:flex-row`}>
      {/* Toolbar on the left */}
      <Toolbar />

      {/* Group Header and Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        <main className="flex-1 p-4 bg-gray-951">
          {children}
        </main>
      </div>
    </div>
  );
}
