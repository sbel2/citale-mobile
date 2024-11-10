import { supabase } from '@/app/lib/definitions';

export const signUpUser = async ({ email, password }: { email: string; password: string }) => {
  // Call the sign-up function
  const { data, error } = await supabase.auth.signUp({ email, password });

  // Check for explicit "User already registered" error
  if (error) {
    if (error.message.includes('User already registered')) { 
      throw new Error('This email is already registered. Please proceed to sign in.');
    }
    else if(error.code == "email_not_confirmed"){
      throw new Error('This email has not been verified. Please check your inbox.');
    }
    throw new Error(error.message);
  }
  
  return data;
};

export const signInUser = async ({ email, password }: { email: string; password: string }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    // Custom error handling based on specific messages
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Password incorrect. Please try again.');
    } else if (error.message.includes('User not found')) {
      throw new Error('No account found with this email. Please sign up.');
    }
    throw new Error(error.message);
  }

  return data;
};