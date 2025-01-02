//profile page logic
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId, updateProfile } from '@/app/actions/auth';
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

    const handleEditProfile = async () =>{
        await updateProfile(userId, userName, userEmail);
    }
    

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
            <div className="space-y-4">
                <div className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Image
                    className="h-32 w-32 rounded-full border-4 border-white mx-auto md:mx-0 mb-4"
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/avatar.png`}
                    alt="User Avatar"
                    width={128}
                    height={128}
                    />
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        id="username"
                        type="username"
                        placeholder="Enter your username"
                        value={userName || ""}
                        onChange={(e) => setUserName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="fullname"
                        type="fullname"
                        placeholder="Enter your fullname"
                        value={userEmail || ""}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>
            

            {/* Navigation Links */}
            <div className="mt-4 w-full">
                <button onClick={handleEditProfile}>
                    Save
                </button>
            </div>
        </div>

        
        );
    }