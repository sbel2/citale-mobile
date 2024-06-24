"use client";
import { useEffect, useState } from "react";
import Image from "next/legacy/image";
import Head from "next/head";

interface EventData {
  id: number;
  title: string;
  description: string;
  imageUrl: string[];
}

interface PostComponentProps {
  eventData: EventData;
}

const PostComponent: React.FC<PostComponentProps> = ({ eventData }) => {
  const [error, setError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [datePosted, setDatePosted] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevious = () => {
    const newIndex =
      currentImageIndex > 0
        ? currentImageIndex - 1
        : eventData.imageUrl.length - 1;
    setCurrentImageIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      currentImageIndex < eventData.imageUrl.length - 1
        ? currentImageIndex + 1
        : 0;
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
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % eventData.imageUrl.length
    );
  };

  return (
    <>
      <Head>
        <title>Post Detail</title>
      </Head>
      <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm'>
        <div className='bg-white shadow-lg rounded-lg overflow-hidden w-11/12 max-w-5xl max-h-120vh flex flex-col md:flex-row'>
          <div className='relative flex-1 md:flex-1.5 flex justify-center items-center'>
            {eventData.imageUrl.length > 0 && (
              <div className='relative w-full h-full'>
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${eventData.imageUrl[currentImageIndex]}`}
                  alt={eventData.title}
                  className='rounded-t md:rounded-none md:rounded-l object-cover w-full h-full relative'
                  layout='fill'
                />
                {eventData.imageUrl.length > 1 && ( // Condition to check if there are more than one image
                  <div className='absolute inset-0 flex justify-between items-center'>
                    <button
                      className='w-10 h-10 bg-black bg-opacity-75 text-white flex items-center justify-center rounded-full'
                      onClick={handlePrevious}
                      aria-label='Previous Image'
                    >
                      &lt;
                    </button>
                    <button
                      className='w-10 h-10 bg-black bg-opacity-75 text-white flex items-center justify-center rounded-full'
                      onClick={handleNext}
                      aria-label='Next Image'
                    >
                      &gt;
                    </button>
                  </div>
                )}
                <span className='absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs'>
                  {`${currentImageIndex + 1}/${eventData.imageUrl.length}`}
                </span>
              </div>
            )}
          </div>

          <div className='flex-1 p-4 flex flex-col justify-between'>
            <div className='flex items-center mb-4'>
              <img
                src='https://via.placeholder.com/50'
                alt='Profile'
                className='w-10 h-10 rounded-full mr-4'
              />
              <div>
                <p className='text-sm font-medium mb-1'>hoamsy</p>
              </div>
            </div>
            <div className='flex-1 overflow-y-auto'>
              <h4 className='text-lg font-bold mb-4 text-black'>
                {eventData.title}
              </h4>
              <div className='preformatted-text'>{eventData.description}</div>
              <p className='text-xs text-gray-500'>{datePosted}</p>
            </div>
            <div className='flex justify-end items-center space-x-4 mt-4'>
              <button className='flex items-center' onClick={handleLike}>
                {liked ? (
                  <svg fill='red' viewBox='0 0 24 24' className='w-6 h-6'>
                    <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                  </svg>
                ) : (
                  <svg
                    fill='none'
                    stroke='black'
                    strokeWidth='1.25'
                    viewBox='0 0 24 24'
                    className='w-6 h-6'
                  >
                    <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                  </svg>
                )}
                <span className='ml-2'>{likesCount}</span>
              </button>
              <button className='flex items-center' onClick={handleFavorite}>
                {favorited ? (
                  <svg fill='#FFD700' viewBox='2 2 20 20' className='w-6 h-6'>
                    <path d='M12 17.27l5.5 3.23-1.47-6.17L21 9.54l-6.24-0.54L12 3l-2.76 6-6.24 0.54 4.71 4.79L6.5 20.5 12 17.27z' />
                  </svg>
                ) : (
                  <svg
                    fill='none'
                    stroke='black'
                    strokeWidth='1.25'
                    viewBox='0 0 24 24'
                    className='w-6 h-6'
                  >
                    <path d='M12 17.27l5.5 3.23-1.47-6.17L21 9.54l-6.24-0.54L12 3l-2.76 6-6.24 0.54 4.71 4.79L6.5 20.5 12 17.27z' />
                  </svg>
                )}
                <span className='ml-2'>{favoritesCount}</span>
              </button>
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
        .navigation-button {
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.75);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
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
        .text-content {
          padding: 20px;
          overflow-y: auto;
        }
        .bg-white {
          min-height: 90vh; /* Minimum height to ensure larger uniform size */
          max-height: 95vh; /* Maximum height to maintain within viewport */
          max-width: 1100px; /* Maximum width to maintain within viewport */
          overflow-y: auto; /* Enables scrolling within the card if content exceeds height */
        }
        .preformatted-text {
          white-space: pre-wrap; /* respects both spaces and line breaks */
        }
      `}</style>
    </>
  );
};

export default PostComponent;
