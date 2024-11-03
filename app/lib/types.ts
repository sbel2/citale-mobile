// all fields are optional and not requried to be read in for code
export interface Post {
    post_id: number;
    title: string;
    description: string;
    mediaUrl: string[];
    like_count: number;
    created_at: string;
    category?: string;
    user_id?: number;
  }
  