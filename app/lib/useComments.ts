import { supabase } from "@/app/lib/definitions";
import { useState } from "react";

interface UseCommentsProps {
    post_id: number;
    user_id?: string;
}

export const useComments = ({ post_id, user_id }: UseCommentsProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const saveComment = async (content: string) => {
        if (!user_id || !content.trim()) return;
        
        setIsSubmitting(true);
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert([{
                    post_id: post_id,
                    user_id: user_id,
                    content: content.trim()
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error saving comment:', error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { saveComment, isSubmitting };
};
