import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  // Log incoming query parameters
  console.log('Incoming Query Parameters:', { token_hash, type, next });

  // Clone the redirectTo URL for proper redirection
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  // Handle missing or invalid query parameters
  if (!token_hash || !type) {
    console.log('Error: Missing token_hash or type. Redirecting to error page.');
    redirectTo.pathname = '/auth/auth-code-error';
    redirectTo.searchParams.set('error', 'Missing token_hash or type');
    return NextResponse.redirect(redirectTo);
  }

  try {
    const supabase = await createClient();

    // Attempt to verify OTP
    console.log('Verifying OTP with Supabase:', { token_hash, type });
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.error('OTP Verification Failed:', error.message);
      redirectTo.pathname = '/auth/auth-code-error';
      redirectTo.searchParams.set('error', 'OTP verification failed');
      return NextResponse.redirect(redirectTo);
    }

    // Successful OTP verification
    console.log('OTP Verified Successfully. Redirecting to:', redirectTo.toString());
    return NextResponse.redirect(redirectTo);

  } catch (e) {
    // Catch any unexpected errors
    console.error('Unexpected Error during OTP Verification:', e);
    redirectTo.pathname = '/auth/auth-code-error';
    redirectTo.searchParams.set('error', 'Unexpected server error');
    return NextResponse.redirect(redirectTo);
  }
}
