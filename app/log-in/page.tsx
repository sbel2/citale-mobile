// app/sign-in/page.tsx
"use client";

import { useState } from 'react';
import LogInForm from '@/components/LogIn';
import { signInUser } from '@/app/actions/auth';

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signInUser({ email, password });
      setError(null);
      return { status: 200, message: "Sign-in successful"}
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return {status: 400, message: "error"}
    }
  };

  return (
    <div>
      <LogInForm onSignIn={handleSignIn}/>
    </div>
  );
}
