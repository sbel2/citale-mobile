import { createClient } from '@/supabase/client';
import { Post } from './types';

const supabase = createClient();

export async function handleFilter(option: string) : Promise<Post[] | null> {
  try {
    if (option === 'all') {
      const { data, error } = await supabase
        .from('posts')
        .select('*');
      if (error) {
        console.error('Error fetching posts:', error);
        return null;
      } 
      return data || [];
    }
    else {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', option);
      if (error) {
        console.error('Error fetching posts:', error);
        return null;
      } 
      return data || [];
    }
  }
  catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};  