'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';

const Toolbar = () => {
  const { push } = useRouter();
  const pathname = usePathname();

  return (
    <nav className="bg-white text-black fixed top-0 left-0 md:h-full md:w-64 w-full h-16 flex md:flex-col items-start md:items-stretch shadow-md z-50 pb-5 md:pb-0">
      <Link href="/" aria-label="Home" className="pt-10 pl-8 pb-10 hidden md:inline">
        <Image
          src="/citale_header.svg"
          alt="Citale Logo"
          width={90}
          height={30}
          priority
        />
      </Link>
      <button onClick={() => push('/')} className={`p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all ${pathname === '/' ? 'text-bold fill-black' : ''}`}>
        <Image
          src={pathname === '/' ? "/home_s.svg" : "/home.svg"}
          alt="Home Icon"
          width={25}
          height={25}
          priority
        />
        <span className="ml-5 hidden md:inline">Home</span>
      </button>
      <button onClick={() => push('/talebot')} className={`p-4 w-full flex justify-center md:justify-start items-center md:hover:bg-gray-200 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 transition-all ${pathname === '/talebot' ? 'text-bold fill-black' : ''}`}>
        <Image
          src={pathname === '/talebot' ? "/robot_s.svg" : "/robot.svg"}
          alt="Robot Icon"
          width={25}
          height={25}
          priority
        />
        <span className="ml-5 hidden md:inline">Talebot</span>
      </button>
    </nav>
  );
};

export default Toolbar;