// all fields are optional and not requried to be read in for code
export interface Post {
    post_id: number;
    title: string;
    description: string;
    is_video: boolean;
    mediaUrl: string[];
    mapUrl: string;
    thumbnailUrl: string;
    like_count: number;
    created_at: string;
    category?: string;
    user_id?: number;
    username?: string;
    avatar_url?: string;
  }
  