"use client"

import React , {useEffect, useState} from "react";
import { useAuth } from 'app/context/AuthContext';
import { createClient } from '@/supabase/client';

const Toolbar: React.FC = () => {
  const supabase = createClient()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState<string | null>(null);
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
    <nav className="bg-gray-800 text-white fixed md:top-0 md:left-0 md:h-full md:w-64 w-full bottom-0 h-16 flex md:flex-col items-start md:items-stretch shadow-md z-50">
      <a
        href="#"
        className="p-4 w-full text-center md:text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        Home
      </a>
      {isLoggedIn?(
        <a
        href="/account/profile"
        className="p-4 w-full text-center md:text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          Profile
        </a>
      ):(
        <a
        href="/log-in"
        className="p-4 w-full text-center md:text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          Profile
        </a>
      )}
      <a
        href="#"
        className="p-4 w-full text-center md:text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        Swipe
      </a>
      <a
        href="#"
        className="p-4 w-full text-center md:text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        Settings
      </a>
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
