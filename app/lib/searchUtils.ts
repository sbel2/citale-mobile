import { createClient } from '@/supabase/client';
import { Post, UserProfile } from './types';
import { validate as isUUID } from 'uuid'; 

const supabase = createClient();

export async function handlePostSearch(
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

export async function handleUserSearch(
  query: string,
  currentUserId?: string
): Promise<UserProfile[]> {
  try {

    const blockedByUsers = currentUserId 
      ? await getBlockers(currentUserId)
      : [];

    const conditions = [
      `username.ilike.%${query}%`,
      `full_name.ilike.%${query}%`,
      `bio.ilike.%${query}%`,
    ];
    if (isUUID(query)) {
      conditions.push(`id.eq.${query}`);
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, full_name, bio')
      .or(conditions.join(','))
      .not('id', 'in', blockedByUsers.length > 0 ? `(${blockedByUsers.join(',')})` : '()');

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}

export const getBlockers = async (userId: string) => {
  // Get users who blocked me
  const { data: blockedByMe } = await supabase
    .from('blocks')
    .select('blocked_id')
    .eq('user_id', userId);

  // Get users I blocked
  const { data: blockedMe } = await supabase
    .from('blocks')
    .select('user_id')
    .eq('blocked_id', userId);

  // Combine both sets of IDs
  const blockedIds = new Set([
    ...(blockedByMe?.map(b => b.blocked_id) || []),
    ...(blockedMe?.map(b => b.user_id) || [])
  ]);

  return Array.from(blockedIds);
};
