import { Inter } from "next/font/google";
import '../../../globals.css';

const inter = Inter({ subsets: ["latin"] });

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} bg-gray-951`}>
      <main>{children}</main>
    </div>
  );
}
