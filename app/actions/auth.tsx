import { supabase } from '@/app/lib/definitions';

export const signUpUser = async ({ email, password }: { email: string; password: string }) => {
  // Call the sign-up function
  const { data, error } = await supabase.auth.signUp({ email, password });

  // Check for explicit "User already registered" error
  if (error) {
    if (error.message.includes('User already registered')) { 
      throw new Error('This email is already registered. Please proceed to sign in.');
    }
    throw new Error(error.message);
  }

  // Detect obfuscated user object for an existing confirmed user
  if (
    data.session === null && // Session will be null for obfuscated or unconfirmed users
    data.user && // Ensure user data exists
    data.user.email === email && // Email matches
    data.user.confirmed_at // Only treat as obfuscated if confirmed_at is not null (indicating a confirmed account)
  ) {
    throw new Error('This email is already registered. Please proceed to sign in.');
  }
  
  return data;
};
