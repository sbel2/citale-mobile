import React from "react";
import Image from "next/image";
import Link from "next/link";

const Toolbar: React.FC = () => {
  return (
    <nav className="bg-white text-black fixed md:top-0 md:left-0 md:h-full md:w-64 w-full bottom-0 h-16 flex md:flex-col items-start md:items-stretch shadow-md z-50">
      <Link href="/" aria-label="Home" className="pt-10 pl-8 pb-10 hidden md:inline">
        <Image
          src="/citale_header.svg"
          alt="Citale Logo"
          width={90}
          height={30}
          priority
        />
      </Link>
      <a href="/" className="p-4 w-full flex justify-center md:justify-start items-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
        <Image
          src="/home.svg"
          alt="Home Icon"
          width={25}
          height={25}
        />
        <span className="ml-5 hidden md:inline">Home</span>
      </a>
      <a href="/talebot" className="p-4 w-full flex justify-center md:justify-start items-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
        <Image
          src="/robot.svg"
          alt="Robot Icon"
          width={25}
          height={25}
        />
        <span className="ml-5 hidden md:inline">Talebot</span>
      </a>
    </nav>
  );
};

export default Toolbar;
