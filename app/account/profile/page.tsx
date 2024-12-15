//profile page logic
"use client";

import { useEffect, useState } from 'react';
import { getUserId } from '@/app/actions/auth';
import { supabase } from '@/app/lib/definitions';
import Image from 'next/image';

export default function ProfilePage() {
    const [userId, setUserId] = useState<string|null>(null);
    const [userName, setUserName] = useState<string|null>(null);
    const [userEmail, setUserEmail] = useState<string|null>(null);
    const [userAvatar, setUserAvatar] = useState<string|null>(null);

    // get user information
    useEffect(() => {
        const fetchUserData = async() =>{
            // get user id, auth function
            const userId = await getUserId();
            if(!userId){
                console.error('UserId not found');
                return;
            }
            setUserId(userId);

            const {data, error} = await supabase
                .from('profiles')
                .select('username, email')
                .eq('id', userId)
                .single();
            if(error){
                console.error('Error fetching user profile:', error.message)
                return;
            }
            setUserName(data?.username || null);
            setUserEmail(data?.email || null);
        };
        fetchUserData();
    },[])

return (
    <div className="p-4">
        <div className="absolute top-4 right-4 flex items-center justify-center w-6 h-6 bg-black bg-opacity-35 rounded-full">
        <Image
            className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/avatar.png`}
            alt="User Avatar"
            width={300}
            height={300} 
        />
        </div>
        <div>
            <span className="text-lg font-bold mb-4 text-black">Username:</span>
            <span className="text-lg font-bold mb-4 text-black">{userName || 'Loading...'}</span>
        </div>
        <div>
            <span className="text-lg font-bold mb-4 text-black">Email:</span>
            <span className="text-lg font-bold mb-4 text-black">{userEmail || 'Loading...'}</span>
        </div>
    </div>
);

}
