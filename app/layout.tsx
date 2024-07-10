// testing github deployment by triggering new commit
import Header from "@/components/header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Citale",
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
        <Script src="https://cdn.amplitude.com/libs/analytics-browser-2.7.4-min.js.gz" strategy="afterInteractive" />
        <Script src="https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.4.1-min.js.gz" strategy="afterInteractive" />
        <Script src="https://cdn.amplitude.com/libs/plugin-autocapture-browser-0.9.0-min.js.gz" strategy="afterInteractive" />
        <Script id="amplitude-init" strategy="afterInteractive">
          {`
            window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1})).promise.then(function() {
              window.amplitude.add(window.amplitudeAutocapturePlugin.plugin());
              window.amplitude.init('25387996e11da39db54aad9c8bc6fd82');
            });
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Header />
        <div className="bg-gray-951">{children}</div>
      </body>
    </html>
  );
}