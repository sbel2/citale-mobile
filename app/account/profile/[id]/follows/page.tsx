'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// import { useAuth } from 'app/context/AuthContext'; // use if we have private page
import { supabase } from '@/app/lib/definitions';
import path from 'path';

export default function FollowsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const userId = pathname.split('/')[3];

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-sm text-gray-600 mb-6">
                    show followers
                </p>
            </div>
        </div>
    );
}