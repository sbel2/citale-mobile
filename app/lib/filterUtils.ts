import { createClient } from '@/supabase/client';
import { Post } from './types';

const supabase = createClient();

export async function handleFilter(option: string) : Promise<Post[] | null> {
  try {
    if (option === 'All') {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .order('like_count', { ascending: false });
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
        .ilike('category', `%${option}%`)
        .order('created_at', { ascending: false })
        .order('like_count', { ascending: false });
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