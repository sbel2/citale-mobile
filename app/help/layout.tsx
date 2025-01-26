import '../globals.css';
import { Inter } from "next/font/google";
import { useState } from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Citale | Talebot',
  description: 'recommendation bot',
};

export default function HelpButton({ children }: { children: React.ReactNode }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const toggleHelp = () => {
    setIsHelpOpen((prev) => !prev);
  };

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <div className="relative flex h-screen">
          {/* Help Button */}
          <button
            onClick={toggleHelp}
            className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg focus:outline-none"
          >
            Help
          </button>

          {/* Help Modal (conditional rendering) */}
          {isHelpOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-semibold mb-4">How can we help you?</h2>
                <p>This is where help content or support options would go.</p>
                <button
                  onClick={toggleHelp}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Main content area */}
          <main className="flex-1 flex justify-center">
            <div className="w-full">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
