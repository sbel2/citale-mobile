'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/context/AuthContext';
import { supabase } from '@/app/lib/definitions';
import Image from 'next/image';
import Linkify from 'react-linkify';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [userAvatar, setUserAvatar] = useState<string>('avatar.png');

    // Fetch user profile data when user is available
    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, email, avatar_url, website, bio, full_name')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setUserProfile(data);
                    setUserAvatar(data.avatar_url || 'avatar.png');
                } else {
                    console.error('Error fetching user profile:', error?.message);
                }
            };
            fetchProfile();
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center p-6 bg-white w-full h-screen">
        {userProfile ? (
            <div className="flex items-start gap-6 md:gap-16">
                {/* Profile Image Section */}
                <div className="flex-shrink-0">
                    <Image
                        className="h-16 w-16 md:h-32 md:w-32 rounded-full border-4 border-white"
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${userAvatar}`}
                        alt="User Avatar"
                        width={128}
                        height={128}
                    />
                </div>

                {/* User Info Section */}
                <div className="flex flex-col justify-center">
                    <div className="flex items-center mb-2">
                    <h2 className="text-l md:text-2xl font-semibold text-gray-800 mr-5">
                        {userProfile.full_name ? userProfile.full_name : userProfile.username}
                    </h2>
                    <button
                        onClick={() => router.push('/account/edit-profile')}
                        className="px-2 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
                    >
                        Edit Profile
                    </button>
                </div>
                <div className="text-base md:text-xl text-gray-600 mb-4">
                    {userProfile.full_name ? userProfile.username : ''}
                </div>
                    {userProfile.website && (
                        <div className="text-sm md:text-md">
                            <Linkify>
                                <a className="text-blue-500">{userProfile.website}</a>
                            </Linkify>
                        </div>
                    )}

                    {/* Bio Section */}
                    <div className="mt-4">
                        <p className="text-sm text-gray-500">{userProfile.bio || 'No bio available'}</p>
                    </div>
                </div>
            </div>
        ) : (
            <p className="text-gray-500">Loading...</p>
        )}
    </div>
    );
} 