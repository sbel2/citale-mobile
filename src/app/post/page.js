'use client';

import { useEffect, useState } from "react";
import Head from "next/head";

const Post = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [datePosted, setDatePosted] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // Get only the date part
  setDatePosted(today);


  const fetchImages = async () => {
    try {
      const response = await fetch(`https://dog.ceo/api/breeds/image/random/3`);  // Change the number of images to fetch
      const data = await response.json();
      setImages(data.message);  // Set an array of images
      console.log("Fetched Images:", data.message);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError(true);
    }
  };

  fetchImages();
}, []);

  const handlePrevious = () => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    setCurrentImageIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
  };

  if (error) {
    return <div>Error loading post. Please try again later.</div>;
  }

  if (!images.length) {
    return <div>Loading...</div>;
  }

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

  return (
    <>
      <Head>
        <title>Post Detail</title>
      </Head>
      <div className="post-container">
        <div className="card">
        <div className="image-container">
          <img src={images[currentImageIndex]} alt="Post Image" className="main-image" />
          <div className="navigation">
            <button className="nav-button" onClick={handlePrevious} aria-label="Previous Image">&lt;</button>
            <button className="nav-button" onClick={handleNext} aria-label="Next Image">&gt;</button>
          </div>
          <span className="image-index">{`${currentImageIndex + 1}/${images.length}`}</span>
        </div>
          <div className="text-container">
            <div className="profile-header">
              <img src="https://via.placeholder.com/50" alt="Profile" className="profile-pic" />
              <div className="profile-details">
                <p style={{ marginBottom: '5px' }}>hoamsy</p>
              </div>
            </div>
            <div className="content">
            <h4 style={{ marginBottom: '20px', marginTop: '20px' }}><strong>10 Things to Do in Boston and Around Mass for This Week</strong></h4>
            <p style={{ lineHeight: 1.4, marginBottom: '20px' }}>
        If you're looking for things to do in Boston or around Mass, here are 10 unique experiences we have coming up to get yourself outdoors 🌸
            </p>
            <p style={{ lineHeight: 1.4, marginBottom: '20px' }}>
                P.S. All experiences have multiple dates. You can get more info and book tix on Hoamsy (via our bio).
            </p>
            <ul style={{ lineHeight: 1.4 }}>
                <li style={{ marginBottom: '20px' }}>June 14th: </li>
                <li>Cool Candle Making over Brews, Long Live Boston</li>
                <li style={{ marginBottom: '20px' }}>Learn Dumpling Making, Cambridge MA</li>

                <li style={{ marginBottom: '20px' }}>June 15th: </li>

                <li>Custom Perfume Making Workshop, Rooting For You, Cambridge MA</li>
                <li>Foraging Walk + Wild Food Picnic, Waltham MA</li>
                <li>Make A Candle Garden, Long Live Boston</li>
                <li>Summer Boating Trip, Marshfield MA</li>
                <li>Pottery Workshop: Make A Clay Serving Bowl, Newton MA</li>
                <li style={{ marginBottom: '20px' }} >Yoga On The Beach, Pleasure Bay Boston</li>

                <li style={{ marginBottom: '20px' }} >June 16th: </li>
                <li>Vintage Cake Decorating Workshop, Long Live Boston</li>
                <li style={{ marginBottom: '20px' }}>Pottery: Make A Mosaic Trivet, Newton MA</li>
            </ul>
            <p style={{ fontSize: '12px', color: '#888' }}> {datePosted}</p>
            </div>
            <div className="footer">
            <button className="icon-button" onClick={handleLike}>
              {/* Heart Icon */}
              {liked ? (
                <svg fill="red" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg fill="none" stroke="black" strokeWidth="1.25" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              )}
              <span>{likesCount}</span>
            </button>
            <button className="icon-button" onClick={handleFavorite}>
              {/* Star Icon */}
              {favorited ? (
                <svg fill="#FFD700" viewBox="2 2 20 20" style={{ transform: "scale(1.15)" }}> {/* Filled state with a consistent fill color and scaled up */}
                  <path d="M12 17.27l5.5 3.23-1.47-6.17L21 9.54l-6.24-0.54L12 3l-2.76 6-6.24 0.54 4.71 4.79L6.5 20.5 12 17.27z"/>
                </svg>
              ) : (
                <svg fill="none" stroke="black" strokeWidth="1.25" viewBox="0 0 24 24" style={{ transform: "scale(1.15)" }}> {/* Unfilled state with a black stroke */}
                  <path d="M12 17.27l5.5 3.23-1.47-6.17L21 9.54l-6.24-0.54L12 3l-2.76 6-6.24 0.54 4.71 4.79L6.5 20.5 12 17.27z"/>
                </svg>
              )}
              <span>{favoritesCount}</span>
            </button>

            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100%; // Ensures the full height is taken
          width: 100%; // Ensures the full width is taken
        }
      `}</style>
      <style jsx>{`
        .post-container {
          position: fixed; // Use fixed to ensure it covers the entire screen
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0,0,0,0.5); // Semi-transparent black background
          backdrop-filter: blur(10px); // Blurred background
        }
        .post-container .card:hover {
      transform: none;
      }
        .card {
          display: flex;
          background: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          overflow: hidden;
          width: 80%;
          max-width: 975px; // Adjust max width as needed
          max-height: 92.5vh; // Adjust min height as needed
        }

        .image-container {
          flex: 1.5;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .navigation {
          display: none;
          position: absolute;
          top: 50%;
          left: 10px; // Closer to the image sides
          right: 10px;
          justify-content: space-between;
          align-items: center;
          transform: translateY(-50%);
        }
        .image-container:hover .navigation {
          display: flex;
        }
        .nav-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.75);
          color: white;
          font-size: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        .image-index {
          position: absolute;
          top: 20px;  // Adjusted from the top edge of the container
          right: 20px;  // Adjusted from the right edge of the container
          background: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 12px;
          z-index: 10;  // Ensure it stays on top of other elements
        }
        .text-container {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: hidden;
          max-height: 800px; /* Adjust this value based on your needs */
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
        .profile-pic {
          border-radius: 30%;
          width: 40px;
          height: 40px;
          margin-right: 10px;
          margin-bottom: 5px;
        }
        .profile-details {
          display: flex;
          flex-direction: column;
        }
        .profile-details strong {
          font-size: 16px;
        }
        .profile-details span {
          font-size: 12px;
          color: #555;
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
        .content p {
          margin: 5px 0;
        }
        .content ul {
          list-style-type: none;
          padding: 0;
          margin: 5px 0;
        }
        .content li {
          margin: 5px 0;
        }
        .footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 20px;
        gap: 15px;
        width: 100%;
        height: 40px;
        margin-top: 10px;
        box-shadow: 0 -2px 2px -2px rgba(0, 0, 0, 0.2);
      }

      .icon-button {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-top: 15px;
      }

      .icon-button svg {
        width: 25px;
        height: 25px;
      }

      .icon-button span {
        margin-left: 8px;
        font-size: 18px;
      }

      `}</style>
    </>
  );
};

export default Post;
