import 'app/globals.css';
import { Inter } from "next/font/google";
import Toolbar from "@/components/toolbar";
import Header from "@/components/header";
import { MediaProvider } from "app/context/MediaContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: 'Citale | Upload',
    description: 'Upload Page',
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-white`}>
                <MediaProvider>
                    <div className="flex h-screen">
                        <div className="md:w-64">
                            <Toolbar />
                        </div>
                        <main className="flex-1 p-4 bg-gray-951">
                            {children}
                        </main>
                    </div>
                </MediaProvider>
            </body>
        </html>
    );
}
