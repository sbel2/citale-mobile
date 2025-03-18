import React from "react";
import dynamic from "next/dynamic";
import { AuthProvider } from "app/context/AuthContext"; // Adjust the path
import { PostHogProvider } from "./providers.jsx";

// Dynamically import IonicWrapper with SSR disabled
const IonicWrapper = dynamic(() => import("components/IonicWrapper"), {
  ssr: false, // 👈 Prevents Next.js from rendering Ionic on the server
});

export const metadata = {
  title: "Things to do in Boston",
  description: "Share and talk",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className="h-[calc(100vh-56px)] overflow-hidden">
        <AuthProvider>
          <PostHogProvider>
            <IonicWrapper> {/* Now dynamically imported without SSR */}
              {children}
            </IonicWrapper>
          </PostHogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
