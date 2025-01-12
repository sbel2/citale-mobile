"use client"

import React , {useEffect, useState} from "react";
import { createClient } from '@/supabase/client';
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from 'app/context/AuthContext';

const Toolbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { push } = useRouter();
  const pathname = usePathname();
  const [userAvatar, setUserAvatar] = useState<string|null>(null);

  useEffect(() => {
    if (user) {
      // Fetch user avatar if the user is logged in
      const fetchUserProfile = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user profile:', error.message);
        } else {
          setUserAvatar(data?.avatar_url || null); // Set avatar URL
        }
      };

      fetchUserProfile();
    } else {
      setUserAvatar(null); // Reset avatar if user logs out
    }
  }, [user]);

  const handleLogout = async () => {
    await logout(); // Use the logout function from context
  };
  

  return (
    <nav className="bg-white text-black fixed md:top-0 md:left-0 md:h-full md:w-64 w-full bottom-0 h-16 flex md:flex-col items-start md:items-stretch shadow-md z-50" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
      <Link href="/" aria-label="Home" className="pt-10 pl-8 pb-10 hidden md:inline">
        <Image src="/citale_header.svg" alt="Citale Logo" width={90} height={30} priority />
      </Link>
      <button onClick={() => push('/')} className={`p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all`}>
        <Image src={pathname === '/' ? "/home_s.svg" : "/home.svg"} alt="Home Icon" width={25} height={25} priority />
        <span className="ml-5 hidden md:inline">Home</span>
      </button>
      <button onClick={() => push('/talebot')} className={`p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all`}>
        <Image src={pathname === '/talebot' ? "/robot_s.svg" : "/robot.svg"} alt="Robot Icon" width={25} height={25} priority />
        <span className="ml-5 hidden md:inline">Talebot</span>
      </button>
      {user ? (
        <a href="/account/profile" className="p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all">
          <Image src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${userAvatar}`} alt="Profile Icon" width={25} height={25} className="rounded-full" priority />
          <span className="ml-5 hidden md:inline">Profile</span>
        </a>
      ) : (
        <a href="/log-in" className="p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all md:hidden block">
          <Image src="/account.svg" alt="Profile Icon" width={25} height={25} priority />
          <span className="ml-5 hidden md:inline">Profile</span>
        </a>
      )}
      <a href={user ? "#" : "/log-in"} onClick={user ? handleLogout : undefined} className="p-3 w-[88%] text-center bg-[#fd0000] text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all mx-auto mt-4 hidden md:block">
        {user ? "Log out" : "Log in"}
      </a>
    </nav>
  );
};

export default Toolbar;