"use client";

import Link from "next/link";
import Image from "next/legacy/image";
import SearchBar from '@/components/SearchBar';
import FilterButton from '@/components/Filter';
import { useAuth } from 'app/context/AuthContext';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
// import { FaHome, FaUserFriends } from 'react-icons/fa';

export default function Header({ font }: { font?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const prevPathnameRef = useRef<string | null>(null);
  const [fromSearch, setFromSearch] = useState(false);
  const { user, logout } = useAuth();
  const [activeButton, setActiveButton] = useState<string>('explore');
  const [fromProfile, setFromProfile] = useState(false);

  useEffect(() => {
    // Check if the previous pathname was "/search-results"
    if (prevPathnameRef.current === '/search-results' && pathname.startsWith('/post')) {
      setFromSearch(true);
    } else {
      setFromSearch(false);
    }

    // Check if the previous pathname was "/account/profile/"
    if (prevPathnameRef.current?.startsWith('/account/profile/')) {
      setFromProfile(true);
    } else {
      setFromProfile(false);
    }

    // Update the ref with the current pathname
    prevPathnameRef.current = pathname;
  }, [pathname]);


  const searchRoute = async (searchQuery: string) => {
    router.push(`/search-results?query=${encodeURIComponent(searchQuery)}`);
  };

  const filterRoute = async (option: string, location: string, price: string ) => {
    router.push(`/filter-results?option=${encodeURIComponent(option)}&location=${encodeURIComponent(location)}&price=${encodeURIComponent(price)}`);
  };


  const handleButtonClick = (buttonName: string, route: string) => {
    setActiveButton(buttonName);
    router.push(route);
  };

  return (
    <header className={`py-1 md:py-3 pt-4 md:pt-6 bg-gray-0 ${font}`}>

      <div className="max-w-[100rem] px-3 md:px-6 mx-auto flex items-center">
        <Link href="/" aria-label="Home" className = "pt-1.5 md:hidden">
          <Image
            src="/citale_header.svg"
            alt="Citale Logo"
            width={105}  // Reduced width
            height={35} // Reduced height
            priority
          />
        </Link>
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-sm p-1 sm:p-2">
            <SearchBar onSearch={searchRoute}/>
          </div>
        </div>
      </div>

      {!pathname.startsWith("/search-results") &&
        !pathname.startsWith("/account/profile/") &&
        !fromSearch && user &&(
        <div className="max-w-[100rem] px-3 md:px-6 mx-auto flex items-center">
        <button className={`p-4 text-x1 w-full flex justify-center items-center focus:outline-none transition-all round-lg ${activeButton === 'explore' ? 'underline' : ''}`}
          onClick={() => handleButtonClick('explore', '/')}
        >
          Explore</button>
        <button className={`p-4 text-x1 w-full flex justify-center items-center focus:outline-none transition-all round-lg ${activeButton === 'following' ? 'underline' : ''}`}
          onClick={() => handleButtonClick('following', '/following-post')}
        >
          Following</button>
      </div>
      )}

      
      {!pathname.startsWith("/search-results") &&
        !pathname.startsWith("/account/profile/") &&
        !fromSearch &&
        !fromProfile && (
          <div className="w-full p-1">
            <FilterButton onFilter={filterRoute} />
          </div>
      )}
      
    </header>
  );
}
