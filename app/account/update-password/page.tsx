'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/app/actions/auth'; // Import the function

const UpdatePasswordContent = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
    <div>
      <p className="mb-4 text-gray-700">Enter your new password below:</p>
      <input
        type="password"
        className="block w-full p-2 border rounded mb-4"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handlePasswordUpdate}
      >
        Update Password
      </button>
    </div>
  );
};

const UpdatePassword = () => (
  <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-bold mb-6 text-center">Password Reset</h2>
    <UpdatePasswordContent />
  </div>
);

export default UpdatePassword;
