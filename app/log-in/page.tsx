// app/sign-in/page.tsx
"use client";

import { useState } from 'react';
import SignInForm from '@/components/LogIn';
import { signInUser } from '@/app/actions/auth';

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signInUser({ email, password });
      // Handle success (e.g., redirect or update UI)
      console.log('Sign-in successful:', result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div>
      <SignInForm onSubmit={handleSignIn} />
    </div>
  );
}
