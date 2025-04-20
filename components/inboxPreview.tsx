"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from 'app/lib/definitions';
import Image from 'next/image';

interface InboxPreviewProps {
  userId: string;
}

interface ChatMessage {
  sender_id: string;
  receiver_id: string;
  content: string;
  sent_at: string;
}

interface UserDetails {
  id: string;
  username: string;
  avatar_url: string;
  message?: string;
  unread_count?: number;
}

const InboxPreview: React.FC<InboxPreviewProps> = ({ userId }) => {
  const router = useRouter();
  const [messengerDetails, setMessengerDetails] = useState<UserDetails[]>([]);

  const checkBlocked = async (otherUserId: string) => {
    const { data } = await supabase
      .from('blocks')
      .select('user_id, blocked_id')
      .or(`and(user_id.eq.${userId},blocked_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},blocked_id.eq.${userId})`);
    return data && data.length > 0;
  };

  // get the latest message
  const handleDisplayMessage = async () => {
    setMessengerDetails([]);
    const { data, error } = await supabase
      .from('chats')
      .select('sender_id, receiver_id, content, sent_at')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error.message);
      return;
    }

    if (data && data.length > 0) {
      // get the latest message among different people
      const latestMessages = data.reduce((acc: Record<string, ChatMessage>, message) => {
        const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
        if (!acc[otherUserId] || new Date(message.sent_at) > new Date(acc[otherUserId].sent_at)) {
          acc[otherUserId] = message;
        }
        return acc;
      }, {});

      // Fetch user details for each conversation
      const userDetailsPromises = Object.entries(latestMessages).map(async ([otherUserId, message]) => {
        const isBlocked = await checkBlocked(otherUserId);
        if (isBlocked) return null;

        const { data: userData } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', otherUserId)
          .single();

        return {
          id: otherUserId,
          username: userData?.username || 'Unknown',
          avatar_url: userData?.avatar_url || 'avatar.png',
          message: message.content,
          unread_count: 0 // This will be updated by handleUnreadMessages
        };
      });

      const userDetails = (await Promise.all(userDetailsPromises)).filter(Boolean) as UserDetails[];
      setMessengerDetails(userDetails);
    } else {
      console.log('No messages found.');
    }
  };

  const handleUnreadMessages = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('sender_id, is_read')
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error fetching unread messages:', error.message);
      return;
    }

    if (data && data.length > 0) {
      // Count unread messages per sender
      const unreadCounts = data.reduce((acc: Record<string, number>, message) => {
        acc[message.sender_id] = (acc[message.sender_id] || 0) + 1;
        return acc;
      }, {});
      setMessengerDetails((prevDetails) =>
        prevDetails.map((user) => {
          const unreadCount = unreadCounts[user.id] || 0; // 確保鍵匹配
          return {
            ...user,
            unread_count: unreadCount,
          };
        })
      );
    } else {
      console.log('No unread messages found.');
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await handleDisplayMessage();
      await handleUnreadMessages();
    };
  
    fetchData();
  }, [userId]);

  return (
    <div className="bg-white">
      <div className="space-y-0">
        {messengerDetails.map((user) => (
          console.log(user),
          <div
            key={user.id}
            className="flex items-center p-4 bg-white hover:bg-gray-200 transition-shadow cursor-pointer"
            onClick={() => router.push(`/inbox/${user.id}`)} 
          >
            <div className="relative w-12 h-12 shrink-0">
            {/* Avatar */}
            <div className="w-full h-full rounded-full overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_CDN}/profile-pic/${user.avatar_url}` || `${process.env.NEXT_PUBLIC_IMAGE_CDN}/profile-pic/avatar.png`}
                alt={user.username}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>

            {/* Red dot with unread count */}
            {(user.unread_count || 0) > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {user.unread_count}
              </div>
            )}
            </div>

            {/* username and message */}
            <div className="transform translate-x-4 ml-4 flex-1">
              <div className="font-medium text-gray-900">{user.username}</div>
              <div className="text-sm text-gray-500 truncate">{user.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InboxPreview;