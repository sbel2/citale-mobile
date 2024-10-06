import { supabase } from '@/lib/definitions';

export const signUpUser = async ({ email, password }: { email: string; password: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);  // Throw error to be caught in UI
  }

  return data;  // Return user data on success
};
