'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/context/AuthContext';
import { supabase } from '@/app/lib/definitions';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Linkify from 'react-linkify';
import { Post } from '@/app/lib/types';
import styles from '@/components/postComponent.module.css'
import { Button } from '@nextui-org/react';

const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [userAvatar, setUserAvatar] = useState<string>('avatar.png');
    const [fetchSuccess, setFetchSuccess] = useState<boolean>(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setloading] = useState<boolean>(true);
    const [firstLoad, setFirstLoad] = useState<boolean>(true);
    const [displayCAtagory, setDisplayCAtagory] = useState<string>('My Posts')

    const postButtons = ['My Posts', 'My likes', 'My Archived'];
    // Fetch user profile data from Supabase
    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, email, avatar_url, website, bio, full_name')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching user profile:', error.message);
                    return;
                }
                setUserAvatar(data.avatar_url || 'avatar.png');  // Set avatar URL
                setUserProfile(data);  // Store the entire user profile
                setFetchSuccess(true);
                handleFetchUserPosts(user.id);
            };

            fetchUserData();
        } else {
            console.error('User is not logged in');
        }
    }, [user]);

    const handleFetchUserPosts = async (userId: string) => {
        const { data, error } = await supabase
        .from("posts")
            .select("post_id, title, description, is_video, mediaUrl, mapUrl, thumbnailUrl, user_id, like_count, created_at")
            .eq('user_id', userId);
        if (error || !data) {
            console.error('Error fetching post data:', error);
            setPosts([]);
            setloading(false);
            } 
        else {
            setPosts(data);
            setloading(false);
        }
    };

    const handleFetchLikePosts = async (userId: string) => {
    };

    const handleArchivePosts = async (postId: string) => {
    };

    //check if user entered a query and calling onsearch to fetch results
    const handleCategoryClick = async (option: string, userId: string) => {
        setDisplayCAtagory(option);
        if (option === 'My Posts'){
            await handleFetchUserPosts(userId);
            console.log(posts)
        }
    };


    // Link decorator for clickable URLs in bio
    const linkDecorator = (href: string, text: string, key: number): React.ReactNode => {
        if (!isValidUrl(href)) {
            return <span key={key}>{text}</span>;
        }

        return (
            <a href={href} key={key} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                {text}
            </a>
        );
    };

    // Simple URL validation
    function isValidUrl(string: string): boolean {
        try {
            new URL(string);
        } catch (_) {
            return false;
        }
        return true;
    }

    const handleLogout = async () => {
        await logout();  // Use logout from context
        router.push('/');
    };

    const handleEditProfile = () => {
        router.push('/account/edit-profile');
    };

    const handleReturn = () => {
        router.push('/');
    };

    return (
        <div className="w-full min-h-screen bg-white">
            {userProfile ? (
                <div className="px-4 pt-3">
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 mb-4">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${userAvatar}`}
                                alt="Profile"
                                width={128}
                                height={128}
                                className="rounded-full object-cover"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-xl font-medium">
                                {userProfile.full_name ? userProfile.full_name : userProfile.username}
                            </h1>
                            <button
                                onClick={() => router.push('/account/edit-profile')}
                                className="px-2 py-1.5 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                Edit Profile
                            </button>
                        </div>
    
                        <div className="text-gray-500 text-sm mb-4">
                        {userProfile.full_name && userProfile.username ? userProfile.username : ''}
                        </div>
                        
                        {userProfile.website && (
                            <div className="text-sm mb-4">
                                <Linkify>
                                    <a className="text-blue-500 hover:text-blue-600">{userProfile.website}</a>
                                </Linkify>
                            </div>
                        )}
                        
                        <p className="text-gray-600 text-sm mb-4">{userProfile.bio || 'No bio yet'}</p>
                    </div>
                            {user ? (
                        <div>
                            <div className="flex m-2 xl:justify-center hide-scrollbar">
                            {postButtons.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => handleCategoryClick(category, user.id)}
                                className={`px-3 py-3 rounded-full text-sm min-w-max ${displayCAtagory === category || (displayCAtagory === 'myPosts' && category === 'myPosts') ? 'bg-gray-300' : 'bg-white'}`}
                            >
                            {category}
                            </button>
                    ))}
                        </div>
                    </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                    
                    <div className={styles.container}>
                        {posts.length === 0 ? (
                            <p className="text-center">No posts found :) </p>
                        ) : (
                            <MasonryGrid posts={posts} />
                        )}
                    </div>
                    <div className="flex justify-center border-b"></div>
                </div>
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-gray-500">Loading...</p>
                </div>
            )}
        </div>
    );
}