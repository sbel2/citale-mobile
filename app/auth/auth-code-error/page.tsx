'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ErrorMessage from '@/components/ErrorMessage';

export default function AuthCodeError() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('error');

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Error</h2>
      <p className="text-red-600 text-center">
        <Suspense fallback={<div>Loading error message...</div>}>
          <ErrorMessage message={errorMessage || 'An unknown error occurred. Please try again.'} />
        </Suspense>
      </p>
    </div>
  );
}

