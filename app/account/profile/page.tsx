//profile page logic
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId } from '@/app/actions/auth';
import { supabase } from '@/app/lib/definitions';
import Image from 'next/image';
import Link from 'next/link';
import { set } from 'zod';
import Linkify from 'react-linkify';

export default function ProfilePage() {
    const [userId, setUserId] = useState<string|null>(null);
    const [userName, setUserName] = useState<string|null>(null);
    const [userEmail, setUserEmail] = useState<string|null>(null);
    const [userAvatar, setUserAvatar] = useState<string|null>(null);
    const [userWebsite, setUserWebsite] = useState<string|null>(null);
    const [userBio, setUserBio] = useState<string|null>(null);
    const [fullName, setFullName] = useState<string|null>(null);
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
                .select('username, email, avatar_url, website, bio, full_name')
                .eq('id', userId)
                .single();
            if(error){
                console.error('Error fetching user profile:', error.message)
                return;
            }
            setUserName(data?.username || null);
            setUserEmail(data?.email || null);
            setUserAvatar(data?.avatar_url || null);
            setFullName(data?.full_name || null);
            setUserWebsite(data?.website || null);
            setUserBio(data?.bio || null);
        };
        fetchUserData();
    },[])

    // making the link in post clickable
    const linkDecorator = (href: string, text: string, key: number): React.ReactNode => {
      // Validate the URL
        if (!isValidUrl(href)) {
        return <span key={key}>{text}</span>;  // Just return text if URL is invalid
        }
    
        return (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
            {text}
        </a>
    );
    };
    // Simple URL validation function
    function isValidUrl(string: string): boolean {
        try {
        new URL(string);
        } catch (_) {
        return false;  // Malformed URL
        }
        return true;
    }

    const handleLogout = async () =>{
        await supabase.auth.signOut();
        router.push('/');
    };

    const handleEditProfile = async () =>{
        router.push('/account/edit-profile');
    };

    const handleReturn = async () => {
		router.push('/');
	};

    return (
        <div className="flex flex-col items-center max-w-md mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
        
            <div className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Image
                    className="h-32 w-32 rounded-full border-4 border-white mx-auto md:mx-0 mb-4"
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${userAvatar}`}
                    alt="User Avatar"
                    width={128}
                    height={128}
                />
                <h2 className="text-lg font-bold">{fullName || null}</h2>
                <h2 className="text-lg font-bold">{userName || "Loading..."}</h2>
                <p className="text-sm text-gray-300">{userEmail || "Loading..."}</p>
                <div className="mt-4 w-full">
                    <Linkify componentDecorator={linkDecorator}>{userWebsite}</Linkify>
                </div>
                <p className="text-sm text-gray-300">{userBio || "Loading..."}</p>
            </div>

            {/* Navigation Links */}
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
                <button onClick={handleReturn}>
                    Back
                </button>
            </div>
        </div>
        );
    }