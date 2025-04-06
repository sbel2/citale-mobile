'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/context/AuthContext';
import { supabase } from '@/app/lib/definitions';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Post } from '@/app/lib/types';
import styles from '@/components/postComponent.module.css'
import FollowingPopup from "./following/following";
import FollowerPopup from "./follower/follower";
import BlockingPopup from './block/blocking';
import DeletePopup from '@/components/deletePopup';

const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });

export default function ProfilePage({ params }: { params: { id: string } }) {
    const { id: userId } = params;
    const { user, logout } = useAuth();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [userAvatar, setUserAvatar] = useState<string>('avatar.png');
    const [fetchSuccess, setFetchSuccess] = useState<boolean>(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setloading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [deletePost, setDeletePost] = useState<boolean>(false);
    const [editPost, setEditPost] = useState<boolean>(false);
    const [managePostData, setManageData] = useState({id: 0, postAction: ""})
    const [displayCAtagory, setDisplayCAtagory] = useState<string>('Posts')
    const [following, setFollowing] = useState<boolean>(false);
    const [followingCount, setFollowingCount] = useState<number>(0);
    const [followersCount, setFollowersCount] = useState<number>(0);
    // open follow detail pop up
    const [isFollowingOpen, setIsFollowingOpen] = useState(false);
    const [isFollowerOpen, setIsFollowerOpen] = useState(false);
    // display buttons on profile pages
    const postButtons = ['Posts', 'Likes', 'Favs'];
    const postButtons_others = ['Posts']
    // const relationshipButtons = ['Following', 'Followers'];
    const [blocked, setBlocked] = useState<boolean>(false);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);
    const [isBlockingOpen, setIsBlockingOpen] = useState(false);
    const [blockedCount, setBlockedCount] = useState(0);
    const [viewerIsBlocked, setViewerIsBlocked] = useState(false);
    // blocks n stuff idk anymore

    // Fetch user profile data from Supabase
    useEffect(() => {
        
        const fetchUserData = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('username, email, avatar_url, website, bio, full_name')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error.message);
                return;
            }
            setUserAvatar(data.avatar_url || 'avatar.png');  // Set avatar URL
            setUserProfile(data);  // Store the entire user profile
            setFetchSuccess(true);
            handleFetchUserPosts(userId);
        };

        fetchUserData();
        
    }, [userId]);

    const handleFetchUserPosts = async (userId: string) => {
        const { data, error } = await supabase
        .from("posts")
            .select("*")
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
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

    const handleFetchUserDrafts = async (userId: string) => {
        const { data, error } = await supabase
        .from("drafts")
            .select("*")
            .eq('user_id', userId);
        if (error || !data) {
            console.error('Error fetching drafts data:', error);
            setPosts([]);
            setloading(false);
            } 
        else {
            setPosts(data);
            setloading(false);
        }
    };

    const handleFetchLikedPosts = async (userId: string) => {
        const { data, error } = await supabase
            .from('likes') // Assuming there's a 'likes' table
            .select('post_id')
            .eq('user_id', userId);
    
        if (error || !data) {
            console.error('Error fetching liked posts:', error);
            setPosts([]);
            setloading(false);
        } else {
            const likedPostIds = data.map((like) => like.post_id);
            const { data: postsData, error: postsError } = await supabase
                .from('posts')
                .select('*')
                .in('post_id', likedPostIds);
    
            if (postsError || !postsData) {
                console.error('Error fetching liked posts data:', postsError);
                setPosts([]);
                setloading(false);
            } else {
                setPosts(postsData);
                setloading(false);
            }
        }
    };

    const handleFetchFavoritePosts = async (userId: string) => {
        const { data, error } = await supabase
            .from('favorites') // Assuming there's a 'likes' table
            .select('post_id')
            .eq('user_id', userId);
    
        if (error || !data) {
            console.error('Error fetching favorited posts:', error);
            setPosts([]);
            setloading(false);
        } else {
            const FavoritedPostIds = data.map((like) => like.post_id);
            const { data: postsData, error: postsError } = await supabase
                .from('posts')
                .select('*')
                .in('post_id', FavoritedPostIds);
    
            if (postsError || !postsData) {
                console.error('Error fetching faved posts data:', postsError);
                setPosts([]);
                setloading(false);
            } else {
                setPosts(postsData);
                setloading(false);
            }
        }
    };

    const toggleDropdown = () => {
        setIsOpen((prevState) => !prevState)
    }

    const toggleDeletePopUp = () => {
        setDeletePost((prevState) => !prevState);
    }

    const managePost = (manageType: string, postId: number, postAction: string) => {
        if (manageType == "delete") {
            setManageData({
                id: postId,
                postAction: postAction,
            })
            toggleDeletePopUp();
        }
    }

    const resetPosts = (updatedPosts: Post[]) => {
        setPosts(updatedPosts);
    }
    //check if user entered a query and calling onsearch to fetch results
    const handleCategoryClick = async (option: string, userId: string) => {
        setDisplayCAtagory(option);
        if (option === 'Posts') {
            await handleFetchUserPosts(userId);
            if (isOpen) {
                toggleDropdown()
            }
        } else if (option === 'Likes') {
            await handleFetchLikedPosts(userId);
            if (isOpen) {
                toggleDropdown()
            }
        } else if (option === 'Favs') {
            await handleFetchFavoritePosts(userId);
            if (isOpen) {
                toggleDropdown()
            }
        // } else if (option === 'Drafts') {
        //     await handleFetchUserDrafts(userId);
        //     if (isOpen) {
        //         toggleDropdown()
        //     }
        }
    };
    
    const handleFollowButton = async () => {
        const {data, error}  = await supabase
        .from('relationships')
        .select('user_id, follower_id')
        .eq('user_id', user?.id) // the user that is logged in
        .eq('follower_id',userId); // the user that is displaying on this profile page

        if(data && data.length > 0){
            // unfollow
            setFollowing(true);
        } else {
            // follow
            setFollowing(false);
        }
    };

    const handleBlockButton = async () => {
        const {data, error} = await supabase
        .from('blocks')
        .select('user_id, blocked_id')
        .eq('user_id', user?.id)
        .eq('blocked_id', userId);

        if(data && data.length > 0){
            setBlocked(true);
        } else {
            setBlocked(false);
        }
    };

    useEffect(() => {
        const handleCalcFollowers = async () => {
            const { data, error } = await supabase
            .from('relationships')
            .select('user_id, follower_id')
            .eq('follower_id', userId);
    
            if (error) {
                console.error('Error fetching followers:', error.message);
            }
            if (data){
                setFollowersCount(data.length);
            }
        };

        const handleCalcFollowings = async () => {
            const { data, error } = await supabase
            .from('relationships')
            .select('user_id, follower_id')
            .eq('user_id', userId);
    
            if (error) {
                console.error('Error fetching followers:', error.message);
            }
            if (data){
                setFollowingCount(data.length);
            }
        };

        handleCalcFollowers();
        handleCalcFollowings();
        if (user && user.id !== userId) {
            handleFollowButton();
            handleBlockButton();
        }
    }, [following, blocked, userId]);


    const handleFollow = async () => {
        const { error } = await supabase
        .from('relationships')
        .insert([
            {
                user_id: user?.id,
                follower_id: userId,
            },
        ]);
        if (error) {
            console.error('Error following user:', error.message);
            return;
        }
        setFollowing(true);
    };

    const handleUnFollow = async () => {
        const { error } = await supabase
        .from('relationships')
        .delete()
        .eq('user_id', user?.id)
        .eq('follower_id', userId);

        if (error) {
            console.error('Error unfollowing user:', error.message);
            return;
        }
        setFollowing(false);
    };

    const handleBlock = async () => {
        try {
            const { error: blockError } = await supabase
                .from('blocks')
                .insert([{ user_id: user?.id, blocked_id: userId }]);
            
            if (blockError) throw blockError;
            const { error: removeTheirFollowError } = await supabase
                .from('relationships')
                .delete()
                .eq('user_id', userId)
                .eq('follower_id', user?.id);
            
            if (removeTheirFollowError) throw removeTheirFollowError;
    
            setBlocked(true);
            setBlockedCount(prev => prev + 1);
            
            const { count: followersCount } = await supabase
                .from('relationships')
                .select('*', { count: 'exact' })
                .eq('follower_id', userId);
    
            setFollowersCount(followersCount || 0);
        } catch (error) {
            console.error('Error blocking user:', error);
        }
    };
    
    const handleUnblock = async () => {
        const { error } = await supabase
            .from('blocks')
            .delete()
            .eq('user_id', user?.id)
            .eq('blocked_id', userId);
        
        if (error) {
            console.error('Error unblocking user:', error.message);
            return;
        }
        setBlocked(false);
        setBlockedCount(prev => prev - 1);
    };

    useEffect(() => {
        const fetchBlockedCount = async () => {
            if (user && user.id === userId) {
                const { count } = await supabase
                    .from('blocks')
                    .select('*', { count: 'exact' })
                    .eq('user_id', userId);
                
                setBlockedCount(count || 0);
            }
        };

        const checkIfBlocked = async () => {
            if (user && user.id !== userId) {
                const { data, error } = await supabase
                    .from('blocks')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('blocked_id', user.id)
                    .single();
    
                if (data) {
                    setViewerIsBlocked(true);
                }
            }
        };
        
        checkIfBlocked();
        fetchBlockedCount();
    }, [user, userId]);

    return (
        <div className="w-full min-h-screen bg-white pb-20 md:pb-0">
            {userProfile ? (
                <div className="px-4 pt-5">
                    {/* Always show basic profile info */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 mb-4">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_IMAGE_CDN}/profile-pic/${userAvatar}`}
                                alt="Profile"
                                width={128}
                                height={128}
                                className="rounded-full object-cover"
                            />
                        </div>
                        <h1 className="text-xl font-medium">
                            {userProfile.full_name ? userProfile.full_name : userProfile.username}
                        </h1>
                    </div>
    
                    {/* Blocked user message (only addition) */}
                    {viewerIsBlocked && (
                        <div className="text-center p-4">
                            <p className="text-gray-500">You are blocked from viewing this profile</p>
                        </div>
                    )}
    
                    {/* Your exact original content wrapped in !viewerIsBlocked */}
                    {!viewerIsBlocked && (
                        <>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-3 mb-2">
                                    {user && user.id === userId && (
                                        <button
                                            onClick={() => router.push('/account/edit-profile')}
                                            className="px-2 py-1.5 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                                        >   
                                            Edit Profile
                                        </button>
                                    )}
                                    {user && user.id !== userId && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => following ? handleUnFollow() : handleFollow()}
                                                className="px-2 py-1.5 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                                            >   
                                                {following ? 'Unfollow' : 'Follow'}
                                            </button>
                                            <button
                                                onClick={() => blocked ? handleUnblock() : setShowBlockConfirm(true)}
                                                className="px-2 py-1.5 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                                            >   
                                                {blocked ? 'Unblock' : 'Block'}
                                            </button>
                                            {showBlockConfirm && (
                                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                    <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                                                        <h3 className="font-medium text-lg mb-4">Confirm Block</h3>
                                                        <p className="mb-6">
                                                            Are you sure you want to block this user? 
                                                            They won't be able to follow you or see your profile.
                                                        </p>
                                                        <div className="flex justify-end gap-3">
                                                            <button
                                                                onClick={() => setShowBlockConfirm(false)}
                                                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    await handleBlock();
                                                                    setShowBlockConfirm(false);
                                                                }}
                                                                className="px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded"
                                                            >
                                                                Block User
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
            
                                <div className="text-gray-500 text-sm mb-4">
                                {userProfile.full_name && userProfile.username ? userProfile.username : ''}
                                </div>
                                
                                {userProfile.website && (
                                    <div className="text-sm mb-4">
                                        <a 
                                            href={userProfile.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-500 hover:text-blue-600 break-all"
                                        >
                                            {userProfile.website}
                                        </a>
                                    </div>
                                )}
    
                                <p className="text-gray-600 text-sm mb-6">{userProfile.bio || 'No bio yet'}</p>
    
                                <div className="flex space-x-10 mb-6">
                                    <button onClick={() => setIsFollowingOpen(true)} className="btn">
                                        <p className="text-sm text-gray-500 mr-2">Following</p>
                                        <p className="text-sm font-medium">{followingCount}</p>
                                    </button>
                                    <FollowingPopup isOpen={isFollowingOpen} setIsOpen={setIsFollowingOpen} />
                                    <button onClick={() => setIsFollowerOpen(true)} className="btn">
                                        <p className="text-sm text-gray-500 mr-2">
                                            {followersCount <= 1 ? "Follower" : "Followers"}
                                        </p>
                                        <p className="text-sm font-medium">{followersCount}</p>
                                    </button>
                                    <FollowerPopup isOpen={isFollowerOpen} setIsOpen={setIsFollowerOpen} />
                                    {user && user.id === userId && (
                                        <button 
                                            onClick={() => setIsBlockingOpen(true)}
                                            className="btn"
                                        >
                                            <p className="text-sm text-gray-500 mr-2">Blocking</p>
                                            <p className="text-sm font-medium">{blockedCount}</p>
                                        </button>
                                    )}
                                    <BlockingPopup 
                                        isOpen={isBlockingOpen} 
                                        setIsOpen={setIsBlockingOpen}
                                        blockedCount={blockedCount}
                                        setBlockedCount={setBlockedCount}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex m-2 xl:justify-center hide-scrollbar mb-6">
                                        {user && user.id === userId && (
                                            postButtons.map((category) => (
                                                <button
                                                    key={category}
                                                    type="button"
                                                    onClick={() => handleCategoryClick(category, userId)}
                                                    className={`px-3 py-3 rounded-full text-sm min-w-max ${displayCAtagory === category || (displayCAtagory === 'myPosts' && category === 'myPosts') ? 'bg-gray-300' : 'bg-white'}`}
                                                >
                                                {category}
                                                </button>
                                            ))
                                        )}
                                        {user && user.id !== userId && (
                                            postButtons_others.map((category) => (
                                                <button
                                                    key={category}
                                                    type="button"
                                                    onClick={() => handleCategoryClick(category, userId)}
                                                    className={`px-3 py-3 rounded-full text-sm min-w-max ${displayCAtagory === category || (displayCAtagory === 'myPosts' && category === 'myPosts') ? 'bg-gray-300' : 'bg-white'}`}
                                                >
                                                {category}
                                                </button>
                                                    ))
                                        )}
                                </div>
                            </div>
                            <div className="border-b border-gray-300 mb-5"></div>
                            
                            <div className={styles.container}>
                                {posts.length === 0 ? (
                                    <p className="text-center">No posts found :) </p>
                                ) : (
                                    <div>
                                        {deletePost && (
                                            <DeletePopup posts={posts} postStatus={managePostData.postAction} postId={managePostData.id} resetPosts={resetPosts} togglePopup={toggleDeletePopUp}/>
                                        )}
                                        <MasonryGrid posts={posts} managePost={managePost}/>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-gray-500">Loading...</p>
                </div>
            )}
        </div>
    );    
}

function order(arg0: string, arg1: { ascending: boolean; }) {
    throw new Error('Function not implemented.');
}
