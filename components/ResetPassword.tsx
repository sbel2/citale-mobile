// components/auth/LogInForm.tsx
"use client";

import { useState } from 'react';

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
    <div className="flex flex-col items-center max-w-md mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Reset Password</h1>
      <form onSubmit={handleSubmit} className="w-full flex flex-col">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send login link
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
        </p>
        )}
    </div>
  );
}
