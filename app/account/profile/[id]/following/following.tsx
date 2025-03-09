'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from 'app/context/AuthContext';
import { supabase } from '@/app/lib/definitions';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Dialog, DialogTrigger, DialogContentForFollow, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface FollowingPopupProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}


const FollowingPopup: React.FC<FollowingPopupProps> = ({ isOpen, setIsOpen }) => {
    const router = useRouter();
    const pathname = usePathname();
    const userId = pathname.split('/')[3];
    const { user, logout } = useAuth();
    const [followingDetails, setFollowingDetails] = useState<{ id: string; username: string; avatar_url_small: string }[]>([]);
    const [followingCount, setFollowingCount] = useState<number>(0)


    useEffect(() => {
        if (isOpen) {
            handleDisplayFollowings();
        }
    }, [isOpen]);
    
    const handleClose = () => {
        setIsOpen(false);
        router.back();
    };


    const handleDisplayFollowings = async () => {
        setFollowingDetails([])
        const { data, error } = await supabase
        .from('relationships')
        .select('user_id, follower_id')
        .eq('user_id', userId);

        if (error) {
            console.error('Error fetching followings:', error.message);
        }
        if (data){
            if (data.length > 0) {
                setFollowingCount(data.length)
                setFollowingDetails([])
                for (let i = 0; i < data.length; i++) {
                    handleFetchUser(data[i].follower_id);
                }
            }
        }
    }

    const handleFetchUser = async (userId: string) => {
        const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url_small')
        .eq('id', userId)
        .single();

        if (error) {
            console.error('Error fetching user:', error.message);
        }
        if (data) {
            setFollowingDetails(prevDetails => {
                // Check again before updating the state to avoid race conditions
                if (!prevDetails.some(user => user.id === userId)) {
                    return [...prevDetails, data];
                }
                return prevDetails;
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContentForFollow className="w-full max-w-xs h-64 overflow-y-auto rounded-lg">
                <div className="p-6 text-center">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold">Show Followings : {followingCount}</p>
                        <DialogClose onClick={handleClose} className="p-2 rounded-full"></DialogClose>
                    </div>
                    <ul className="mt-4 space-y-4">
                        {followingDetails.map((user, index) => (
                            <li key={`${index}-${user.id}`} className="flex items-center space-x-2">
                                <button className="flex items-center space-x-2" onClick={() => router.push(`/account/profile/${user.id}`)}>
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_IMAGE_CDN}/profile-pic/${user.avatar_url_small}`}
                                        alt="profile"
                                        width={25}
                                        height={25}
                                        className="rounded-full"
                                    />
                                    <p>{user.username}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </DialogContentForFollow>
        </Dialog>
    );
}

export default FollowingPopup;