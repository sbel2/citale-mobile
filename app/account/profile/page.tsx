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

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const handleReturn = () => router.push('/');

    return (
        <div className="flex flex-col items-center max-w-md mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
            <div className="p-3 mb-4 border border-gray-300 rounded-lg">
                {userProfile ? (
                    <>
                        <Image
                            className="h-32 w-32 rounded-full border-4 border-white mx-auto mb-4"
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${userAvatar}`}
                            alt="User Avatar"
                            width={128}
                            height={128}
                        />
                        <h2 className="text-lg font-bold">{userProfile.full_name || 'No Name'}</h2>
                        <h2 className="text-lg font-bold">{userProfile.username || 'Loading...'}</h2>
                        <p className="text-sm text-gray-300">{userProfile.email || 'Loading...'}</p>
                        {userProfile.website && (
                            <div className="mt-4">
                                <Linkify>{userProfile.website}</Linkify>
                            </div>
                        )}
                        <p className="text-sm text-gray-300">{userProfile.bio || 'No bio available'}</p>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

            <div className="mt-4 w-full">
                <button onClick={() => router.push('/account/edit-profile')} className="p-4 w-full hover:bg-gray-700">
                    Edit Profile
                </button>
                <button onClick={handleLogout} className="p-4 w-full hover:bg-gray-700">
                    LogOut
                </button>
            </div>

            <div className="mt-4 w-full">
                <button onClick={handleReturn} className="p-4 w-full hover:bg-gray-700">
                    Back
                </button>
            </div>
        </div>
    );
}
