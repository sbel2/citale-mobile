import { createClient } from '@/supabase/client';
import { Post } from './types';

const supabase = createClient();

export async function handleSearch(query: string): Promise<Post[] | null> {
  try {
    const { data, error } = await supabase
<<<<<<< HEAD
      .from('testPost')
      .select('post_id, title, description, is_video, mediaUrl, thumbnailUrl, mapUrl,user_id, like_count, created_at, video_type')
=======
      .from('posts')
      .select('post_id, title, description, is_video, mediaUrl, thumbnailUrl, mapUrl,user_id, like_count, favorite_count, created_at')
>>>>>>> origin/main
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
