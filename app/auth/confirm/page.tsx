'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/definitions';

const ConfirmEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>('Verifying your email...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const confirmUser = async () => {
      try {
        // Get the token from the URL search parameters
        const token = searchParams.get('token');

        if (!token) {
          setError('Invalid confirmation link.');
          setMessage('');
          return;
        }

        // Exchange the token for a session
        const { error } = await supabase.auth.exchangeCodeForSession(token);

        if (error) {
          setError('Invalid or expired confirmation link.');
          setMessage('');
          return;
        }

        setMessage('Your email has been successfully confirmed!');

        // Optionally redirect the user to the home page after confirmation
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } catch (err) {
        setError('An error occurred during confirmation.');
        setMessage('');
      }
    };

    confirmUser();
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Email Confirmation</h2>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default ConfirmEmail;
