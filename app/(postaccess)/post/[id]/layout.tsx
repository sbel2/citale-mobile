import { Inter } from "next/font/google";
import '../../../globals.css';

const inter = Inter({ subsets: ["latin"] });

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
      </head>
      <body className={inter.className}>
        <main className="bg-gray-951">{children}</main>
      </body>
    </html>
  );
}