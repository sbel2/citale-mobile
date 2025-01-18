'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/context/AuthContext';  // Using the AuthContext
import { supabase } from '@/app/lib/definitions';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Linkify from 'react-linkify';
import { Post } from '@/app/lib/types';
import styles from '@/components/postComponent.module.css'
import { Button } from '@nextui-org/react';

const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });

export default function ProfilePage() {
    const { user, logout } = useAuth();  // Use context for user and logout
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
        <div className="flex flex-col items-center max-w-md mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
            <div className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {userProfile ? (
                    <div>
                        <Image
                            className="h-32 w-32 rounded-full border-4 border-white mx-auto md:mx-0 mb-4"
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${userAvatar}`}
                            alt="User Avatar"
                            width={128}
                            height={128}
                        />
                        <h2 className="text-lg font-bold">{userProfile.full_name || 'No Name'}</h2>
                        <h2 className="text-lg font-bold">{userProfile.username || 'Loading...'}</h2>
                        <p className="text-sm text-gray-300">{userProfile.email || 'Loading...'}</p>
                        {userProfile.website && (
                            <div className="mt-4 w-full">
                                <Linkify componentDecorator={linkDecorator}>{userProfile.website}</Linkify>
                            </div>
                        )}
                        <p className="text-sm text-gray-300">{userProfile.bio || 'No bio available'}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
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

            <div className="mt-4 w-full">
                <button
                    onClick={handleEditProfile}
                    className="p-4 w-full text-center md:text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                    Edit Profile
                </button>
                <button
                    onClick={handleLogout}
                    className="p-4 w-full text-center md:text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                    LogOut
                </button>
            </div>

            <div className="mt-4 w-full">
                <button onClick={handleReturn} className="p-4 w-full text-center md:text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    Back
                </button>
            </div>
        </div>
    );
}
