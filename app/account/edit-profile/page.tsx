//profile page logic
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId } from '@/app/actions/auth';
import { supabase } from '@/app/lib/definitions';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
    const [userId, setUserId] = useState<string|null>(null);
    const [userName, setUserName] = useState<string|null>(null);
    const [userEmail, setUserEmail] = useState<string|null>(null);
    const [userAvatar, setUserAvatar] = useState<string|null>(null);
    const router = useRouter();

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

    const handleLogout = async () =>{
        await supabase.auth.signOut();
        router.push('/');
      };

    const handleEditAvatar = async () =>{
        await supabase
    };

    return (
        <div className="flex flex-col items-center max-w-md mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
        
            <div className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Image
                className="h-32 w-32 rounded-full border-4 border-white mx-auto md:mx-0 mb-4"
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/avatar.png`}
                alt="User Avatar"
                width={128}
                height={128}
                />
                <button
                onClick={handleEditAvatar}
                className="p-4 w-full text-center md:text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                Edit Profile Picture
                </button>
                <h2 className="text-lg font-bold">{userName || "Loading..."}</h2>
                <p className="text-sm text-gray-300">{userEmail || "Loading..."}</p>
            </div>

            {/* Navigation Links */}
            <div className="mt-4 w-full">
                
            </div>
        </div>
        );
    }