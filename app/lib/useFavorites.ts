// hooks/useLikes.ts

import { supabase } from "@/app/lib/definitions";
import { useState, useEffect } from "react";
// hooks/useFavorites.ts

interface UseFavoriteProps {
    postId: number;
    userId?: string;
    initialFavoriteCount: number;
}

export const useFavorite = ({ postId, userId, initialFavoriteCount }: UseFavoriteProps) => {
    const [favorited, setFavorited] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(initialFavoriteCount);

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
        setFavoritesCount(prev => prev + 1);
        setFavorited(true);
    };

    const removeFavorite = async () => {
        if (!userId) return;

        const { error } = await supabase
            .from('favorites')
            .delete()
            .match({ user_id: userId, post_id: postId });
        
        if (error) throw new Error(`Failed to remove favorite: ${error.message}`);
        
        await updatePostFavoriteCount(favoritesCount - 1);
        setFavoritesCount(prev => prev - 1);
        setFavorited(false);
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

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            if (!userId) return;

            try {
                const { data, error } = await supabase
                    .from('favorites')
                    .select()
                    .match({ user_id: userId, post_id: postId })
                    .maybeSingle();

                if (error) throw error;
                setFavorited(!!data);
            } catch (error) {
                console.error('Error fetching favorite status:', error);
            }
        };

        fetchFavoriteStatus();
    }, [userId, postId]);

    return { favorited, favoritesCount, toggleFavorite };
};
