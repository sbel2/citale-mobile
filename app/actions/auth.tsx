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
  if (data.session === null && data.user && data.user.email === email && !data.user.confirmed_at) {
    throw new Error('This email is already registered. Please proceed to sign in.');
  }
  
  return data;
};
