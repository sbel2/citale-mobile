'use client';

import React, { useEffect, useState } from "react";
import { createClient } from '@/supabase/client';
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from 'app/context/AuthContext';

const Toolbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [userAvatar, setUserAvatar] = useState<string>('/account.svg'); // Default placeholder
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { push } = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Fetch and set user avatar
  const fetchUserAvatar = async (userId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      if (error || !data?.avatar_url) {
        console.warn('Error fetching avatar:', error?.message || 'Avatar not found');
        return '/account.svg'; // Fallback to placeholder
      }

      const avatarUrl = data.avatar_url;
      localStorage.setItem('userAvatar', avatarUrl); // Cache avatar in localStorage
      return avatarUrl;
    } catch (err) {
      console.error('Unexpected error fetching avatar:', err);
      return '/account.svg'; // Fallback to placeholder
    }
  };

  // Initialize user avatar
  useEffect(() => {
    const initializeAvatar = async () => {
      if (user) {
        const storedAvatar = localStorage.getItem('userAvatar');
        if (storedAvatar) {
          setUserAvatar(storedAvatar);
        } else {
          const avatar = await fetchUserAvatar(user.id);
          setUserAvatar(avatar);
        }
      } else {
        setUserAvatar('/account.svg'); // Reset to placeholder if no user
      }
      setLoading(false);
    };

    initializeAvatar();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('userAvatar'); // Clear cached avatar
    push('/');
  };

  return (
    <nav className="bg-white text-black fixed md:top-0 md:left-0 md:h-full md:w-64 w-full bottom-0 h-16 flex md:flex-col items-start md:items-stretch shadow-md z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <Link href="/" aria-label="Home" className="pt-10 pl-8 pb-10 hidden md:inline">
        <Image src="/citale_header.svg" alt="Citale Logo" width={90} height={30} priority />
      </Link>

      {/* Home Button */}
      <button
        onClick={() => push('/')}
        className={`p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all ${pathname === '/' ? 'font-semibold' : ''}`}
      >
        <Image src={pathname === '/' ? "/home_s.svg" : "/home.svg"} alt="Home Icon" width={25} height={25} priority />
        <span className="ml-5 hidden md:inline">Home</span>
      </button>

      {/* Talebot Button */}
      <button
        onClick={() => push('/talebot')}
        className={`p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all ${pathname === '/talebot' ? 'font-semibold' : ''}`}
      >
        <Image src={pathname === '/talebot' ? "/robot_s.svg" : "/robot.svg"} alt="Robot Icon" width={25} height={25} priority />
        <span className="ml-5 hidden md:inline">Talebot</span>
      </button>

      {/* Profile Button */}
      {user ? (
        <Link href="/account/profile" className={`p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all ${pathname === '/account/profile' ? 'font-semibold' : ''}`}>
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${userAvatar}`}
            alt="Profile Icon"
            width={25}
            height={25}
            className="rounded-full"
            priority
            onError={() => setUserAvatar('/account.svg')} // Fallback if image fails to load
          />
          <span className="ml-5 hidden md:inline">Profile</span>
        </Link>
      ) : (
        <Link href="/log-in" className="p-4 w-full flex justify-center md:justify-start items-center">
          <Image src="/account.svg" alt="Profile Icon" width={25} height={25} priority />
          <span className="ml-5 hidden md:inline">Profile</span>
        </Link>
      )}

      {/* Log in Button */}
      {!loading && !user && (
        <Link
          href="/log-in"
          className="p-3 w-[88%] text-center bg-[#fd0000] text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all mx-auto mt-4 hidden md:block"
        >
          Log in
        </Link>
      )}

      {/* Menu Button */}
      <div className="md:mt-auto w-full relative">
        {isMenuOpen && (
          <div className="absolute bottom-full mb-2 left-0 md:left-0 bg-white shadow-md rounded-lg w-full md:w-64">
            {user ? (
              <a href="#" onClick={handleLogout} className="block p-4 hover:bg-gray-200 text-red-600">Log out</a>
            ) : (
              <Link href="/log-in" className="block p-4 hover:bg-gray-200 text-black-600">Log in</Link>
            )}
          </div>
        )}
        <button
          onClick={toggleMenu}
          className="p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all"
        >
          <Image src="/menu.svg" alt="Menu Icon" width={25} height={25} priority />
          <span className="ml-5 hidden md:inline">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default Toolbar;
