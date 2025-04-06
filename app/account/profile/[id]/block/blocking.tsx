'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from 'app/context/AuthContext';
import { supabase } from '@/app/lib/definitions';
import { Dialog, DialogContentForFollow, DialogClose } from "@/components/dialog";

interface BlockingPopupProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    blockedCount: number;
    setBlockedCount: (count: number) => void;
}

const BlockingPopup: React.FC<BlockingPopupProps> = ({ isOpen, setIsOpen, blockedCount, setBlockedCount}) => {
    const router = useRouter();
    const pathname = usePathname();
    const userId = pathname.split('/')[3];
    const { user, logout } = useAuth();
    const [blockedDetails, setBlockedDetails] = useState<{ id: string; username: string; avatar_url_small: string }[]>([]);

    useEffect(() => {
        if (isOpen) {
            handleDisplayBlockedUsers();
        }
    }, [isOpen]);
    
    const handleClose = () => {
        setIsOpen(false);
        router.back();
    };

    const handleDisplayBlockedUsers = async () => {
        setBlockedDetails([]);
        const { data, error } = await supabase
            .from('blocks')
            .select('blocked_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching blocked users:', error.message);
        }
        if (data) {
            setBlockedCount(data.length); // Update the count here
            if (data.length > 0) {
                setBlockedDetails([]);
                for (let i = 0; i < data.length; i++) {
                    handleFetchUser(data[i].blocked_id);
                }
            }
        }
    };

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
            setBlockedDetails(prevDetails => {
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
                        <p className="text-lg font-semibold">Blocked Users: {blockedCount}</p>
                        <DialogClose onClick={handleClose} className="p-2 rounded-full"></DialogClose>
                    </div>
                    <ul className="mt-4 space-y-4">
                        {blockedDetails.map((user, index) => (
                            <li key={`${index}-${user.id}`} className="flex items-center space-x-2">
                                <button 
                                    className="flex items-center space-x-2" 
                                    onClick={() => router.push(`/account/profile/${user.id}`)}
                                >
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

export default BlockingPopup;