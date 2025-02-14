import { AuthProvider } from 'app/context/AuthContext'; // Adjust the path to where your AuthProvider is located
import Script from 'next/script';
import posthog from 'posthog-js'
import { PostHogProvider } from './providers.jsx'

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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
      </head>
      <body>
        <AuthProvider> {/* Keep the AuthProvider here */}
          <PostHogProvider> {/* Wrap the children with PostHogProvider */}
            {children}
          </PostHogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
