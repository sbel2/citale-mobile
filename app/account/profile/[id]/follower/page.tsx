'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from 'app/context/AuthContext';
import { supabase } from '@/app/lib/definitions';
import path from 'path';
import { set, string } from 'zod';

export default function FollowerPage() {
    const router = useRouter();
    const pathname = usePathname();
    const userId = pathname.split('/')[3];
    const { user, logout } = useAuth();
    const [followerDetails, setFollowerDetails] = useState<{ id: string; username: string; avatar_url: string }[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [followerCount, setFollowerCount] = useState<number>(0)


    useEffect(() => {
        setFollowerDetails([])
        setIsClient(true);
        handleDisplayFollowings();
    }, []);
    
    const handleClose = () => {
        router.back();
    };


    const handleDisplayFollowings = async () => {
        setFollowerDetails([])
        const { data, error } = await supabase
        .from('relationships')
        .select('user_id, follower_id')
        .eq('follower_id', userId);

        if (error) {
            console.error('Error fetching followings:', error.message);
        }
        if (data){
            if (data.length > 0) {
                setFollowerCount(data.length)
                setFollowerDetails([])
                for (let i = 0; i < data.length; i++) {
                    handleFetchUser(data[i].user_id);
                }
            }
        }
    }

    const handleFetchUser = async (userId: string) => {
        const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', userId)
        .single();

        if (error) {
            console.error('Error fetching user:', error.message);
        }
        if (data) {
            setFollowerDetails(prevDetails => {
                // Check again before updating the state to avoid race conditions
                if (!prevDetails.some(user => user.id === userId)) {
                    return [...prevDetails, data];
                }
                return prevDetails;
            });
        }
    };

    if (!isClient) {
        return null; // Render nothing on the server
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="flex items-center space-x-4 mb-4">
                    <p className="text-sm text-gray-600">
                        show followers
                    </p>
                    <button onClick={handleClose}>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                    </button>
                </div>
                {followerDetails && (
                    <ul className='space-y-4'>
                    {followerDetails.map((user: any, index: number) => (
                        <li key={`${index}-${user.id}`} className="flex items-center space-x-2">
                            <button className="flex items-center space-x-2" onClick={() => router.push(`/account/profile/${user.id}`)}>
                                <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${user.avatar_url}`} alt="profile" width={25} height={25}/>
                                <p>{user.username}</p>
                                <p></p>
                            </button>
                        </li>
                    ))}
                    </ul>   
                )}
                {!followerDetails &&(
                    <p>No Follower Found :(</p>
                )}
            </div>
        </div>
    );
}