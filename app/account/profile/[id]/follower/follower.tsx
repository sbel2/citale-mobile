'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from 'app/context/AuthContext';
import { supabase } from '@/app/lib/definitions';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Dialog, DialogTrigger, DialogContentForFollow, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface FollowerPopupProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const FollowerPopup: React.FC<FollowerPopupProps> = ({ isOpen, setIsOpen }) => {
    const router = useRouter();
    const pathname = usePathname();
    const userId = pathname.split('/')[3];
    const { user, logout } = useAuth();
    const [followerDetails, setFollowerDetails] = useState<{ id: string; username: string; avatar_url: string }[]>([]);
    const [followerCount, setFollowerCount] = useState<number>(0)


    useEffect(() => {
        if (isOpen) {
            handleDisplayFollowers();
        }
    }, [isOpen]);
    
    const handleClose = () => {
        setIsOpen(false);
        router.back();
    };


    const handleDisplayFollowers = async () => {
        setFollowerDetails([])
        const { data, error } = await supabase
        .from('relationships')
        .select('user_id, follower_id')
        .eq('follower_id', userId);

        if (error) {
            console.error('Error fetching followings:', error.message);
        }
        if (data){
            if (data.length > 0) {
                setFollowerCount(data.length)
                setFollowerDetails([])
                for (let i = 0; i < data.length; i++) {
                    handleFetchUser(data[i].user_id);
                }
            }
        }
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
            setFollowerDetails(prevDetails => {
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
            <DialogContentForFollow className="w-full max-w-xs h-64">
                <div className="p-6 text-center">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold">Show Followings : {followerCount}</p>
                        <DialogClose onClick={handleClose} className="p-2 rounded-full"></DialogClose>
                    </div>
                    <ul className="mt-4 space-y-4">
                        {followerDetails.map((user, index) => (
                            <li key={`${index}-${user.id}`} className="flex items-center space-x-2">
                                <button className="flex items-center space-x-2" onClick={() => router.push(`/account/profile/${user.id}`)}>
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${user.avatar_url}`}
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

export default FollowerPopup;