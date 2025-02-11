import { create } from 'zustand';

interface LikeState {
    likes: Record<number, { count: number; liked: boolean }>;
    updateLike: (postId: number, count: number, liked: boolean) => void;
}

export const useLikeStore = create<LikeState>((set) => ({
    likes: {},
    updateLike: (postId, count, liked) =>
        set((state) => ({
            likes: { ...state.likes, [postId]: { count, liked } }
        }))
}));
