// components/auth/LogInForm.tsx
"use client";

import { useState } from 'react';

type LogInFormProps = {
  onSignIn: (email: string, password: string) => Promise<void>;
};

export default function LogInForm({ onSignIn }: LogInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Reset message on new submit attempt

    try {
      const response = await onSignIn(email, password);
      if (response.status === 200){
        setMessage({ text: 'Sign-in successful! Redirecting...', type: 'success' });
      }
      else if (response.status === 400){
        setMessage({ text: 'Password incorrect. Please try again', type: 'error' });
      }

    } catch (err) {
      console.error('Sign-in error:', err);
      if (err instanceof Error) {
        // Differentiate messages based on error content
        if (err.message.includes('Invalid login credentials')) {
          setMessage({ text: 'Password incorrect. Please try again.', type: 'error' });
        } else if (err.message.includes('User not found')) {
          setMessage({ text: 'No account found. Please sign up.', type: 'error' });
        } else {
          setMessage({ text: err.message, type: 'error' });
        }
      } else {
        setMessage({ text: 'An unexpected error occurred.', type: 'error' });
      }
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Sign In</h1>
      <form onSignIn={handleSubmit} className="w-full flex flex-col">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign In
        </button>
      </form>

      {/* Display success or error message */}
      {message && (
        <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
