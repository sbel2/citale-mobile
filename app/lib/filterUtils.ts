import { createClient } from '@/supabase/client';
import { Post } from './types';

const supabase = createClient();

export async function handleFilter(
  option: string,
  location: string,
  price: string,
  currentUserId?: string
): Promise<Post[]> {
  try {
    // Get users who have blocked the current user
    let blockedByUsers: string[] = [];
    if (currentUserId) {
      const { data: blockers, error } = await supabase
        .from('blocks')
        .select('user_id')
        .eq('blocked_id', currentUserId);

      if (!error) {
        blockedByUsers = blockers?.map(b => b.user_id) || [];
      }
    }

    // Build main query
    let query = supabase
      .from('posts')
      .select('*')
      .or(`endDate.is.null,endDate.gte.${new Date().toISOString().split('T')[0]}`);

    // Apply filters
    if (option !== 'All') query = query.ilike('category', `%${option}%`);
    if (location !== 'All') query = query.ilike('location', `%${location}%`);
    if (price !== 'All') query = query.eq('price', price);

    // Exclude blocked users' content
    if (blockedByUsers.length > 0) {
      query = query.not('user_id', 'in', `(${blockedByUsers.join(',')})`);
    }

    // Execute final query
    const { data, error } = await query.order('created_at', { ascending: false });

    return error ? [] : data || [];
  } catch (error) {
    console.error('Filter error:', error);
    return [];
  }
}
