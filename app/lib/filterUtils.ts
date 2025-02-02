import { createClient } from '@/supabase/client';
import { Post } from './types';

const supabase = createClient();

export async function handleFilter(option: string, location: string, price: string): Promise<Post[] | null> {
  try {
    let query = supabase.from('posts').select('*');

    // Apply filters dynamically
    if (option !== 'All') {
      query = query.ilike('categories_short', `%${option}%`);
    }
    if (location !== 'All') {
      query = query.ilike('location_short', `%${location}%`);
    }
    if (price !== 'All') {
      query = query.ilike('price', `%${price}%`);
    }

    // Apply ordering
    query = query.order('created_at', { ascending: false }).order('like_count', { ascending: false });

    // Fetch data
    const { data, error } = await query;

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
