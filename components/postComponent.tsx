"use client";
import React from "react";
import { useEffect, useState } from "react";
import Head from "next/head";
import Linkify from "react-linkify";

interface PostComponentProps {
  post_id: number;
  title: string;
  description: string;
  imageUrl: string[];
}

const linkDecorator = (
  href: string,
  text: string,
  key: number
): React.ReactNode => {
  // Validate the URL
  if (!isValidUrl(href)) {
    return <span key={key}>{text}</span>; // Just return text if URL is invalid
  }

  return (
    <a
      href={href}
      key={key}
      target='_blank'
      rel='noopener noreferrer'
      style={{ color: "blue", textDecoration: "underline" }}
    >
      {text}
    </a>
  );
};

// Simple URL validation function
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
  } catch (_) {
    return false; // Malformed URL
  }
  // Add more sophisticated checks like domain whitelist, etc.
  return true;
}

const PostComponent: React.FC<PostComponentProps> = ({
  post_id,
  title,
  description,
  imageUrl,
}) => {
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [datePosted, setDatePosted] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // Get only the date part
    setDatePosted(today);
  }, []);

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

  const handleFavorite = () => {
    if (!favorited) {
      setFavoritesCount(favoritesCount + 1);
    } else {
      setFavoritesCount(favoritesCount - 1);
    }
    setFavorited(!favorited);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrl.length);
  };

  return (
    <>
      <Head>
        <title>Post Detail</title>
      </Head>
      <div className='post-container'>
        <div className='card'>
          <div className='image-container'>
            {imageUrl.length > 0 && (
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${imageUrl[currentImageIndex]}`}
                alt={title}
                className='rounded-t md:rounded-none md:rounded-l object-contain w-full h-full relative'
              />
            )}
            {imageUrl.length > 1 && (
              <div className='navigation'>
                <button
                  className='nav-button'
                  onClick={handlePrevious}
                  aria-label='Previous Image'
                >
                  &lt;
                </button>
                <button
                  className='nav-button'
                  onClick={handleNext}
                  aria-label='Next Image'
                >
                  &gt;
                </button>
              </div>
            )}
            <span className='absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs'>
              {`${currentImageIndex + 1}/${imageUrl.length}`}
            </span>
          </div>

          <div className='text-container'>
            <div className='profile-header'>
              <img
                src='https://via.placeholder.com/50'
                alt='Profile'
                className='w-10 h-10 rounded-full mr-4'
              />
              <div>
                <p className='text-sm font-medium mb-1'>hoamsy</p>
              </div>
            </div>
            <div className='content'>
              <h4 className='text-lg font-bold mb-4 text-black'>{title}</h4>
              <div className='preformatted-text'>
                <Linkify componentDecorator={linkDecorator}>
                  {description}
                </Linkify>
              </div>
              <div className='text-xs text-gray-500'>{datePosted}</div>
            </div>
            <div className='footer'>
              <button className='icon-button' onClick={handleLike}>
                {liked ? (
                  <svg
                    fill='red'
                    stroke='red'
                    stroke-width='2'
                    viewBox='0 0 24 24'
                    className='icon'
                  >
                    <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                  </svg>
                ) : (
                  <svg
                    fill='none'
                    stroke='black'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                    className='icon'
                  >
                    <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                  </svg>
                )}
                <span className='icon-text'>{likesCount}</span>
              </button>
              {/* favourite button save for later */}
              {/* <button className='icon-button' onClick={handleFavorite}>
                {favorited ? (
                  <svg
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='#FFD700'
                    stroke='#FFD700'
                    stroke-width='2'
                    className='icon'
                  >
                    <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
                  </svg>
                ) : (
                  <svg
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    stroke='currentColor'
                    stroke-width='2'
                    className='icon'
                  >
                    <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
                  </svg>
                )}
                <span className='icon-text'>{favoritesCount}</span>
              </button> */}
            </div>
          </div>
          <button
            className='absolute top-5 right-5 bg-gray-600 bg-opacity-50 text-white p-1 rounded-full flex items-center justify-center'
            style={{ width: "30px", height: "30px", lineHeight: "30px" }}
            onClick={() => window.history.back()}
            aria-label='Close Post'
          >
            &#x2715;
          </button>
        </div>
      </div>
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100%;
          width: 100%;
        }
      `}</style>
      <style jsx>{`
        .post-container {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.1); /* Black with 50% opacity */
          backdrop-filter: blur(
            4px
          ); /* Small blur - adjust blur value as needed */
        }
        .card {
          display: flex;
          background: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          overflow: hidden;
          width: 100%;
          max-width: 1200px; // Adjust max width as needed
          max-height: 90.5vh; // Adjust min height as needed
        }

        @media (min-width: 768px) {
          .image-container {
            flex: 1.4;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            width: 100%; /* Take up all available width */
            /* Height automatically adjusts to content */
          }

          .image-container img {
            width: 100%; /* Image takes full width of the container */
            height: auto; /* Height adjusts to maintain the aspect ratio */
            max-height: 100%; /* Ensure it doesn't exceed the container height */
            object-fit: contain; /* Ensures the entire image is visible */
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

        .image-container:hover .navigation {
          display: flex;
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
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: hidden;
          max-height: 800px; /* Adjust this value based on your needs */
          color: black;
        }

        .profile-header {
          display: flex;
          align-items: center;
          justify-content: start;
          width: 100%;
          padding: 10px;
          box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.1);
          margin-bottom: 10px;
        }

        .content {
          flex: 1;
          width: auto;
          overflow-y: auto; // Allows scrolling
          scrollbar-width: none; // For Firefox
          -ms-overflow-style: none; // For Internet Explorer + Edge

          /* Hiding the scrollbar in WebKit browsers */
          &::-webkit-scrollbar {
            display: none;
          }
        }

        .footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-right: 15px;
          gap: 10px;
          width: 100%;
          height: 30px;
          margin-top: 10px;
          box-shadow: 0 -2px 2px -2px rgba(0, 0, 0, 0.2);
        }

        .icon-button {
          display: flex;
          align-items: center;
          padding: 5px; /* Padding on all sides */
          padding-top: 24px; /* Specific top padding, overriding the general padding */
        }

        .icon-button:focus {
          outline: none; /* Removes focus outline */
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

        .preformatted-text {
          white-space: pre-wrap; /* respects both spaces and line breaks */
          font-size: 15px;
          margin-bottom: 10px;
        }
      `}</style>
    </>
  );
};

export default PostComponent;
