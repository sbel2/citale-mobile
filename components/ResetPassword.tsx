// components/auth/LogInForm.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type ResetProps = {
  onResetPassword: (email: string) => Promise<{  status: number; message?: string }>;
};

export default function ResetForm({ onResetPassword }: ResetProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Reset message on new submit attempt

    const response = await onResetPassword(email);
    if (!response) {
        setMessage({ text: 'No response from server. Please try again later.', type: 'error' });
        return;
    }
    if (response.status === 200) {
        setMessage({ text: 'Password reset email sent successfully! Check your inbox.', type: 'success' });
        // Optionally redirect the user or perform further actions
    } else if (response.status === 400) {
        setMessage({ text:'Failed to reset password. Please try again.', type: 'error' });
    }
};

return (
  <div className="flex items-center justify-center h-[calc(100dvh-56px)] p-4 relative">
      {/* Go Back Button */}
      <a
        href="/"
        aria-label="Go back home"
        className="absolute top-4 left-4 text-gray-800 dark:text-white ml-1"
      >
        &#x2190; Home
      </a>


      {/* Form Container */}
      <div className="w-full h-full p-8 bg-white flex flex-col items-center justify-center md:h-[60%] md:w-[40%] rounded-lg md:border border-gray-200">
          {/* Logo */}
          <Link href="/" aria-label="Home" className="inline-block mb-6">
              <Image
                  src="/citale_header.svg"
                  alt="Citale Logo"
                  width={140}
                  height={50}
                  priority
              />
          </Link>

          {/* Reset Password Form */}
          <h1 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Reset Password</h1>
          <p className="text-gray-600 text-sm mb-6 text-center">
          Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col">
              <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                  Send Reset Link
              </button>

              {message && (
                  <p className={`mt-4 text-sm text-center ${
                      message.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                      {message.text}
                  </p>
              )}

              {/* Additional Links */}
              <div className="mt-6 text-center">
                  <Link 
                      href="/log-in" 
                      className="text-blue-600 hover:underline text-sm"
                  >
                      Return to Login
                  </Link>
              </div>
          </form>
      </div>
  </div>
);
}
