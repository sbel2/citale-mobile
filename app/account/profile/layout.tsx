import '../../globals.css';
import { Inter } from "next/font/google";
import Toolbar from "@/components/toolbar";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: 'Citale | Profile',
    description: 'Profile Page',
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-white`}>
                <div className="flex h-screen">
                    <div className="md:w-64">
                        <Toolbar />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1 p-4 bg-gray-951">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}
