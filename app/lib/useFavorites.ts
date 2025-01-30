import { supabase } from "@/app/lib/definitions";
import { useState, useEffect } from "react";

interface UseFavoriteProps {
    postId: number;
    userId?: string;
    initialFavoriteCount: number;
}

export const useFavorite = ({ postId, userId, initialFavoriteCount }: UseFavoriteProps) => {
    const [favorited, setFavorited] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(initialFavoriteCount);

    const fetchFavoriteStatus = async () => {
        if (!userId) return;

        try {
            // Fetch favorite status for the user
            const { data: favoriteData, error: favoriteError } = await supabase
                .from('favorites')
                .select()
                .match({ user_id: userId, post_id: postId })
                .maybeSingle();

            if (favoriteError) throw favoriteError;
            setFavorited(!!favoriteData);

            // Fetch latest favorite count
            const { data: postData, error: postError } = await supabase
                .from('posts')
                .select('favorite_count')
                .eq('post_id', postId)
                .single();

            if (postError) throw postError;
            setFavoritesCount(postData.favorite_count);
        } catch (error) {
            console.error('Error fetching favorite status:', error);
        }
    };

    const updatePostFavoriteCount = async (count: number) => {
        const { error } = await supabase
            .from('posts')
            .update({ favorite_count: count })
            .eq('post_id', postId);
        
        if (error) throw new Error(`Failed to update post favorite count: ${error.message}`);
    };

    const addFavorite = async () => {
        if (!userId) return;

        const { error } = await supabase
            .from('favorites')
            .insert([{ user_id: userId, post_id: postId }]);
        
        if (error) throw new Error(`Failed to add favorite: ${error.message}`);

        await updatePostFavoriteCount(favoritesCount + 1);
        fetchFavoriteStatus(); // Ensure the UI updates across components
    };

    const removeFavorite = async () => {
        if (!userId) return;

        const { error } = await supabase
            .from('favorites')
            .delete()
            .match({ user_id: userId, post_id: postId });
        
        if (error) throw new Error(`Failed to remove favorite: ${error.message}`);

        await updatePostFavoriteCount(favoritesCount - 1);
        fetchFavoriteStatus(); // Ensure the UI updates across components
    };

    const toggleFavorite = async () => {
        try {
            if (favorited) {
                await removeFavorite();
            } else {
                await addFavorite();
            }
        } catch (error) {
            console.error('Error handling favorite:', error);
        }
    };

    // Fetch favorite status when the component mounts or `postId`/`userId` changes
    useEffect(() => {
        fetchFavoriteStatus();
    }, [userId, postId]);

    // Subscribe to Supabase Realtime updates for this post's favorite count
    useEffect(() => {
        const channel = supabase
            .channel(`favorites_update_${postId}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts', filter: `post_id=eq.${postId}` }, (payload) => {
                setFavoritesCount(payload.new.favorite_count);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [postId]);

    return { favorited, favoritesCount, toggleFavorite };
};
