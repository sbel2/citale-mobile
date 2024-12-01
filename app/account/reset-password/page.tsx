"use client";

import { useState } from 'react';
import ResetForm from '@/components/ResetPassword';
import { resetPasswordByEmail } from '@/app/actions/auth';

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (email: string) => {
    try {
      await resetPasswordByEmail(email);
      setError(null);
      return{status: 200, message: 'Password reset email sent successfully'}
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return { status: 400, message: 'Failed to reset password' };
    }
  };

  return (
    <div>
      <ResetForm onResetPassword={handleResetPassword} />
    </div>
  );
}
