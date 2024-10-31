import { createClient } from '@/supabase/client';

export const supabase = createClient();

// Example type definitions (optional)
export type UserCredentials = {
  email: string;
  password: string;
};
