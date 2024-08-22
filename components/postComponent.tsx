"use client";
import React from "react";
import { useState } from "react";
import Linkify from 'react-linkify';
import Image from 'next/image';

//reading in data from backend
interface PostComponentProps {
    post_id: number;
    title: string;
    description: string;
    imageUrl: string[];
    like_count: number;
    created_at: string;
    user_id: number;
  }

  // making the link in post clickable
  const linkDecorator = (href: string, text: string, key: number): React.ReactNode => {
    // Validate the URL
    if (!isValidUrl(href)) {
      return <span key={key}>{text}</span>;  // Just return text if URL is invalid
    }
  
    return (
      <a href={href} key={key} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
        {text}
      </a>
    );
  };

  // Simple URL validation function
  function isValidUrl(string: string): boolean {
    try {
      new URL(string);
    } catch (_) {
      return false;  // Malformed URL
    }
    // Add more sophisticated checks like domain whitelist, etc.
    return true;
  }

  const PostComponent: React.FC<PostComponentProps> = ({
    post_id,
    title,
    description,
    imageUrl,
    like_count,
    created_at,
    user_id,
  }) => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(like_count);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevious = () => {
      const newIndex =
        currentImageIndex > 0 ? currentImageIndex - 1 : imageUrl.length - 1;
      setCurrentImageIndex(newIndex);
    };
  
    const handleNext = () => {
      const newIndex =
        currentImageIndex < imageUrl.length - 1 ? currentImageIndex + 1 : 0;
      setCurrentImageIndex(newIndex);
    };
    
    const handleLike = () => {
      if (!liked) {
        setLikesCount(likesCount + 1);
      } else {
        setLikesCount(likesCount - 1);
      }
      setLiked(!liked);
    };
  
    return (
    <>
            {/* element for the post card */}
            <div className='card'>
                {/* element for the image */}
                <div className= 'image-container'>
                    {imageUrl.length > 0 && (
                    <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${imageUrl[currentImageIndex]}`}
                    alt={title}
                    fill
                    style={{ objectFit: 'contain' }} // Use objectFit to control how the image scales
                  />
                    )}
                    {imageUrl.length > 1 && (
                        <div className='navigation'>
                            <button className='nav-button' onClick={handlePrevious} aria-label='Previous Image'>&lt;</button>
                            <button className='nav-button' onClick={handleNext} aria-label='Next Image'>&gt;</button>
                        </div>
                    )}
                    <span className='absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs'>
                        {`${currentImageIndex + 1}/${imageUrl.length}`}
                    </span>
                </div>
                {/* element for the text, header, and footer */}
                <div className = 'text-container p-4 md:p-10'>
                  <div className="header">
                    <div className="profile-block">
                    <Image
                      src={`https://qteefmlwxyvxjvehgjvp.supabase.co/storage/v1/object/public/profile-pic/citalelogo.jpg`}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full mr-5"
                    />
                      <p className="profile name">Citale</p>
                    </div>
                  </div>
                  <div className = 'content mt-2 mb-2'>
                      <h4 className='text-lg font-bold mb-4 text-black'>
                          {title}
                      </h4>
                      <div className='preformatted-text'>
                          <Linkify componentDecorator={linkDecorator}>{description}</Linkify>
                      </div>
                      <div className='text-xs text-gray-500 mt-5'>{created_at}</div>
                  </div>
                  <div className = 'footer'>
                      <button className = 'icon-button' onClick = {handleLike}>
                          {liked ? (
                              <svg fill='red' stroke = "red" viewBox='0 0 24 24' className='icon'>
                                  <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                              </svg>
                              ) : (
                              <svg fill='none' stroke='black' viewBox='0 0 24 24' className='icon'>
                                  <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                              </svg>
                          )}
                          <span className='icon-text'>{likesCount}</span>
                      </button>
                  </div>
                </div>
            </div>
        <style jsx global>{`
            html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100%;
            width: 100%;
            }
      `}</style>

        <style jsx>{`

            .card {
            background: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: auto;
            width: 100%; /* Default full width */
            height: 100vh; /* Default full viewport height */
            position: relative;
            }

           @media (min-width: 768px) { /* Adjusts when the screen is wider than 768px */
            .card {
                display: grid;
                width: 62%;
                height: 88%;
                grid-template-columns: 60% 40%;
                margin: auto;
                align-self: center;
                overflow: hidden;
            }}

            .image-container {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            position: relative;
            background: rgba(0, 0, 0, 0.05);
            }

            .image-container:hover .navigation {
            display: flex;
            }

            @media (max-width: 768px) {
              .image-container {
                width: 100%;
                height: 300px; /* Fixed height for small screens */
              }
            }

            .navigation {
            display: none;
            position: absolute;
            top: 50%;
            left: 10px;
            right: 10px;
            justify-content: space-between;
            align-items: center;
            transform: translateY(-50%);
            }

            .nav-button {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.55);
            color: white;
            font-size: 15px;
            font-weight: 300;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            }

            .image-counter {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            }

            .text-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            color: black;
            overflow-y: auto;
            padding: 0px;
            }

            .header{
            height: 75px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.1);
            width: 100%;
            }

            @media (max-width: 768px) {
            .header {
                position: fixed; /* Fixed at the top */
                top: 0; /* Align to the top */
                left: 0; /* Stretch across the top */
                background: white; /* White background */
            }

            .post-container {
                padding-top: 75px; /* Space for the header */
            }}

            .profile-block {
            display: flex;
            align-items: center;
            margin-left: 30px;
            }

            .content{
            flex: 1;
            width: auto;
            padding-right: 20px;
            padding-left: 20px;
            overflow-y: auto;
            overflow-x: hidden;
            word-wrap: break-word;
            white-space: normal;
            scrollbar-width: none;
            -ms-overflow-style: none;
            &::-webkit-scrollbar {
                display: none;
            }}

            .preformatted-text {
            white-space: pre-wrap; /* respects both spaces and line breaks */
            font-size: 15px;
            }
            
            .footer {
              display: flex;
              justify-content: flex-end;
              width: 100%;
              height: 65px;
              box-shadow: 0 -2px 2px -2px rgba(0, 0, 0, 0.3);
            }


            @media (max-width: 768px) {
              .footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: white; /* Ensure the footer has a background color */
              }
            }

            .icon-button {
            display: flex;
            align-items: center;
            padding: 5px; /* Padding on all sides */
            padding-right: 30px; /* Additional right padding */
            }

            .icon {
            width: 23px;
            height: 23px;
            margin-right: 8px; /* Space between icon and text */
            stroke-width: 1.25; /* Ensure stroke width is consistent */
            flex-shrink: 0; /* Prevents icon from shrinking */
            transition: fill 0.2s; /* Smooth fill transition */
            }

            .icon-text {
            font-size: 12px; /* Adjust font size as needed */
            display: inline-block;
            width: 15px;
            text-align: center;
            }

            @media (max-width: 768px) {
            .content {
                margin-bottom: 70px; /* Add bottom margin equal to the footer height */
            }
    `}</style>
    </>
  );
  };
export default PostComponent;
