"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Post } from "@/app/lib/types";
import { supabase } from "@/app/lib/definitions";
import styles from "@/components/postComponent.module.css";

interface PostHeaderProps {
  post: Post;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('avatar.png');
  const router = useRouter();

  useEffect(() => {
      const handleFetchUserProfile = async () => {
        // Fetch user profile data from the server
        const {data, error} = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', post.user_id)
          .single();
        if (error) {
          console.error('Error fetching user profile:', error.message);
          return;
        }
        if(data){
          setUsername(data?.username || '');
          setAvatarUrl(data?.avatar_url || '');
          console.log(data);
        }
      };
      handleFetchUserProfile();
    }, [post.user_id]);

  return (
    <div className={styles.header}>
            <div className="flex items-center ml-8">
              <button onClick={()=>router.push(`/account/profile/${post.user_id}`)} className="flex items-center">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${avatarUrl}`}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full mr-5"
                />
                <p>{username}</p>
              </button>
            </div>
    </div>
  );
};

export default PostHeader;
