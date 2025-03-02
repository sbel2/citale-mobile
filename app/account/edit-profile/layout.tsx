import '../../globals.css';
import { Inter } from "next/font/google";
import Toolbar from "@/components/toolbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: 'Citale | Profile',
    description: 'Profile Page',
};

export default function EProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${inter.className} bg-white flex`}>
            {/* Sidebar */}
            <div className="md:w-64">
                <Toolbar />
            </div>

            {/* Main Content */}
            <main className="flex-1 mb-64 md:ml-64">
                <div>
                    {children}
                </div>
            </main>
        </div>
    );
}
