import { AuthProvider } from 'app/context/AuthContext';

export const metadata = {
  title: "Things to do in Boston",
  description: "share and talk",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
