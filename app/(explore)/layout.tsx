import Header from "@/components/header";
import Toolbar from "@/components/toolbar"; 
import { Inter } from "next/font/google";
import '../globals.css';
import Script from 'next/script';
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Citale | Explore Boston",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Hotjar Script */}
        <Script id="hotjar-script" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:5052807,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col md:flex-row`}>
        {/* Toolbar on the left */}
        <Toolbar />

        {/* Group Header and Main Content */}
        <div className="flex-1 flex flex-col md:ml-64">
          <Header />
          <main className="flex-1 p-4 bg-gray-951">
            {children}
          </main>
        </div>
      </body>

    </html>
  );
}