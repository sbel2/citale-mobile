'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthCodeError() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('error');

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Error</h2>
      <p className="text-red-600 text-center">
        {errorMessage || 'An unknown error occurred. Please try again.'}
      </p>
    </div>
  );
}
