"use client"

import React , {useEffect, useState} from "react";
import { createClient } from '@/supabase/client';
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';

const Toolbar: React.FC = () => {
  const supabase = createClient()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState<string | null>(null);
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setIsLoggedIn(true);
        setUserId(data.user.id);
        console.log(data.user.id)
      }
      else{
        setIsLoggedIn(false);
        setUserId(null);
      }
    };

    getUser();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session)
      if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserId(null);
      }
      else if (event === 'SIGNED_IN') {
        setIsLoggedIn(true);
        if (session && session.user){
          setUserId(session.user.id);
        }
      } 
    });

    // call unsubscribe to remove the callback
    return () => {
      if (data) {
        data.subscription.unsubscribe(); // 
      }
    };
  }, [supabase]); // update whenever state changes

    const handleLogout = async () =>{
      await supabase.auth.signOut();
    };
  

  return (
    <nav className="bg-white text-black fixed md:top-0 md:left-0 md:h-full md:w-64 w-full bottom-0 h-16 flex md:flex-col items-start md:items-stretch shadow-md z-50"
    style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
     <Link href="/" aria-label="Home" className="pt-10 pl-8 pb-10 hidden md:inline">
       <Image
         src="/citale_header.svg"
         alt="Citale Logo"
         width={90}
         height={30}
         priority
       />
     </Link>
     <button onClick={() => push('/')} className={`p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all`}>
       <Image
         src={pathname === '/' ? "/home_s.svg" : "/home.svg"}
         alt="Home Icon"
         width={25}
         height={25}
         priority
       />
       <span className="ml-5 hidden md:inline">Home</span>
     </button>
     <button onClick={() => push('/talebot')} className={`p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all`}>
       <Image
         src={pathname === '/talebot' ? "/robot_s.svg" : "/robot.svg"}
         alt="Robot Icon"
         width={25}
         height={25}
         priority
       />
       <span className="ml-5 hidden md:inline">Talebot</span>
     </button>
      {isLoggedIn?(
        <a
        href="/account/profile"
        className="p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all"
        >
        <Image
         src={pathname === '/account/profile' ? "/account_s.svg" : "/account.svg"}
         alt="Profile Icon"
         width={25}
         height={25}
         priority
       />
       <span className="ml-5 hidden md:inline">Profile</span>
        </a>
      ):(
        <a
        href="/log-in"
        className="p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all"
        >
        <Image
         src="/account.svg"
         alt="Profile Icon"
         width={25}
         height={25}
         priority
       />
       <span className="ml-5 hidden md:inline">Profile</span>
        </a>
      )}
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="p-4 w-full text-center md:text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          LogOut
        </button>
      ):(
        <a
          href="/log-in"
          className="p-4 w-full text-center md:text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          Login
        </a>
      )}
      
    </nav>
  );
};

export default Toolbar;
