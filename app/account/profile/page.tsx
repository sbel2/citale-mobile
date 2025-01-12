'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/context/AuthContext';  // Using the AuthContext
import { supabase } from '@/app/lib/definitions';
import Image from 'next/image';
import Linkify from 'react-linkify';

export default function ProfilePage() {
    const { user, logout } = useAuth();  // Use context for user and logout
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [userAvatar, setUserAvatar] = useState<string>('avatar.png');

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
            };

            fetchUserData();
        } else {
            console.error('User is not logged in');
        }
    }, [user]);

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
                    <>
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
                    </>
                ) : (
                    <p>Loading...</p>
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
