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
    favorite_count: number;
    comment_count: number;
    created_at: string;
    category?: string;
    user_id?: string;
  }
  
  export interface UserProfile {
    username: string;
    avatar_url: string;
  }