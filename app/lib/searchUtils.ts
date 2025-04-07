import { createClient } from '@/supabase/client';
import { Post } from './types';

const supabase = createClient();

export async function handleSearch(
  query: string,
  currentUserId?: string
): Promise<Post[]> {
  try {
    // 1. Get users who have blocked the current user
    const blockedByUsers = currentUserId 
      ? await getBlockers(currentUserId)
      : [];

    // 2. Build main search query
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .or(`endDate.is.null,endDate.gte.${new Date().toISOString().split('T')[0]}`)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .not('user_id', 'in', blockedByUsers.length > 0 ? `(${blockedByUsers.join(',')})` : '()')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Helper function to get blockers
async function getBlockers(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('blocks')
      .select('user_id')
      .eq('blocked_id', userId);

    if (error) throw error;
    return data?.map(b => b.user_id) || [];
  } catch (error) {
    console.error('Block check error:', error);
    return [];
  }
}
