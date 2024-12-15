'use client';

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faRobot } from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";
import Link from "next/link";

const Toolbar: React.FC = () => {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    // Set pathname after component mounts
    setPathname(window.location.pathname);
  }, []);

  // Function to determine if the text should be displayed
  const shouldShowText = () => {
    const isWideScreen = window.matchMedia("(min-width: 768px)").matches;
    return isWideScreen && pathname !== "/talebot";
  };

  return (
    <nav className="bg-white text-black fixed md:top-0 md:left-0 md:h-full md:w-64 w-full bottom-0 h-16 flex md:flex-col items-start md:items-stretch shadow-md z-50">
      <Link href="/" aria-label="Home" className = "pt-1.5">
          <Image
            src="/citale_header.svg"
            alt="Citale Logo"
            width={90}  // Reduced width
            height={30} // Reduced height
            priority
          />
        </Link>
      <a
        href="#"
        className="p-4 w-full flex justify-center md:justify-start items-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <FontAwesomeIcon icon={faHome} style={{ width: '20px', height: '20px' }} />
        {shouldShowText() && <span className="ml-2">Home</span>}
      </a>
      <a
        href="/talebot"
        className="p-4 w-full flex justify-center md:justify-start items-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <FontAwesomeIcon icon={faRobot} style={{ width: '20px', height: '20px' }} />
        {shouldShowText() && <span className="ml-2">Talebot</span>}
      </a>
    </nav>
  );
};

export default Toolbar;
