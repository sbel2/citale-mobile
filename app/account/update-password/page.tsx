'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/app/actions/auth'; // Import the function\
import Link from 'next/link';
import Image from 'next/image';

const UpdatePasswordContent = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordUpdate = async () => {
    setError(null);
    setMessage('Updating your password...');

    try {
      const { success, message } = await updatePassword(password);

      if (!success) {
        setError(message);
        setMessage('');
        return;
      }

      setMessage(message);
      setTimeout(() => router.push('/log-in'), 3000); // Redirect to login or another page
    } catch (e) {
      console.error('Unexpected error during password update:', e);
      setError('An unexpected error occurred.');
      setMessage('');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative">
      {/* Go Back Button */}
      <a
        href="/account/log-in"
        aria-label="Go back to login"
        className="absolute top-4 left-4 text-gray-800 dark:text-white ml-1"
      >
        &#x2190; Back to Login
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

        <h1 className="text-2xl font-semibold mb-2 text-gray-800 text-center">Create New Password</h1>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Your password must be different from previously used passwords.
        </p>

        <div className="w-full">
          <input
            type="password"
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-600 text-sm text-center mb-4">{error}</p>
          )}
          
          {message && (
            <p className="text-green-600 text-sm text-center mb-4">{message}</p>
          )}

          <button
            className="w-full p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            onClick={handlePasswordUpdate}
          >
            Reset Password
          </button>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <Link 
              href="/log-in" 
              className="text-blue-600 hover:underline text-sm"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdatePassword = () => <UpdatePasswordContent />;

export default UpdatePassword;