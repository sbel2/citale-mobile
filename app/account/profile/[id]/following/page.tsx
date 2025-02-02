'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from 'app/context/AuthContext';
import { supabase } from '@/app/lib/definitions';
import path from 'path';
import { set, string } from 'zod';

export default function FollowingPage() {
    const router = useRouter();
    const pathname = usePathname();
    const userId = pathname.split('/')[3];
    const { user, logout } = useAuth();
    const [following, setFollowing] = useState<any>(null);
    const [followingDetails, setFollowingDetails] = useState<{ id: string; username: string; avatar_url: string }[]>([]);


    useEffect(() => {
        handleDisplayFollowings();
        console.log(followingDetails)
    }, []);

    const handleDisplayFollowings = async () => {
        const { data, error } = await supabase
        .from('relationships')
        .select('user_id, follower_id')
        .eq('user_id', userId);

        if (error) {
            console.error('Error fetching followings:', error.message);
        }
        if (data){
            setFollowing(data);
            console.log(data);
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    handleFetchUser(data[i].follower_id);
                }
            }
        }
        console.log(followingDetails)
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
            setFollowingDetails(prevDetails => [...prevDetails, data]);
        }
    };


    

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-sm text-gray-600 mb-6">
                    show followings
                </p>
                
                <ul>
                {followingDetails.map((user: any, index: number) => (
                    <li key={index}>
                        <button onClick={() => router.push(`/account/profile/${user.id}`)}>
                            <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${user.avatar_url}`} />
                            {user.username}
                        </button>
                    </li>
                ))}
                </ul>   
            </div>
        </div>
    );
}