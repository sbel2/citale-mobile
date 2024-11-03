import { createClient } from '@/supabase/client';
import { Post } from './types';

const supabase = createClient();

export async function handleSearch(query: string): Promise<Post[] | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('post_id, title, description, mediaUrl, user_id, like_count, created_at')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .order('like_count', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return null;
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}
