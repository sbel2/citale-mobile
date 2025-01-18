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
        <div className="w-full min-h-screen bg-white">
            {userProfile ? (
                <div className="px-4 pt-6">
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 mb-4">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${userAvatar}`}
                                alt="Profile"
                                width={128}
                                height={128}
                                className="rounded-full object-cover"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-xl font-medium">
                                {userProfile.full_name ? userProfile.full_name : userProfile.username}
                            </h1>
                            <button
                                onClick={() => router.push('/account/edit-profile')}
                                className="px-2 py-1.5 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                Edit Profile
                            </button>
                        </div>
    
                        <p className="text-gray-500 text-sm mb-4">{userProfile.username || ''}</p>
                        
                        {userProfile.website && (
                            <div className="text-sm mb-4">
                                <Linkify>
                                    <a className="text-blue-500 hover:text-blue-600">{userProfile.website}</a>
                                </Linkify>
                            </div>
                        )}
                        
                        <p className="text-gray-600 text-sm mb-4">{userProfile.bio || 'No bio yet'}</p>
                    </div>
    
                    <div className="flex justify-center border-b"></div>
                </div>
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-gray-500">Loading...</p>
                </div>
            )}
        </div>
    );
    
}
