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
      console.log(email , password);
      setError(null);
      return { status: 200, message: "Sign-in successful"}
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.log(email , password);
      return {status: 400, message: "error"}
    }
  };

  return (
    <div>
      <SignInForm onSignIn={handleSignIn} />
    </div>
  );
}
