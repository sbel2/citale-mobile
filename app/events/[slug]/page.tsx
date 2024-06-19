"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Head from "next/head";

const Post = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [datePosted, setDatePosted] = useState("");

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const slug = pathname.split("/").pop();

    if (slug) {
      const today = new Date().toISOString().slice(0, 10);
      setDatePosted(today);

      const fetchImages = async () => {
        try {
          const response = await fetch(
            `https://dog.ceo/api/breeds/image/random/3`
          );
          const data = await response.json();
          setImages(data.message);
          console.log("Fetched Images:", data.message);
        } catch (error) {
          console.error("Error fetching images:", error);
          setError(true);
        }
      };

      fetchImages();
    }
  }, [pathname]);

  const handlePrevious = () => {
    const newIndex =
      currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    setCurrentImageIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
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

  if (error) {
    return <div>Error loading post. Please try again later.</div>;
  }

  if (!images.length) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Post Detail</title>
      </Head>
      <div className="post-container">
        <div className="card">
          <div className="image-container">
            <img
              src={images[currentImageIndex]}
              alt="Post Image"
              className="main-image"
            />
            <div className="navigation">
              <button
                className="nav-button"
                onClick={handlePrevious}
                aria-label="Previous Image"
              >
                &lt;
              </button>
              <button
                className="nav-button"
                onClick={handleNext}
                aria-label="Next Image"
              >
                &gt;
              </button>
            </div>
            <span className="image-index">{`${currentImageIndex + 1}/${
              images.length
            }`}</span>
          </div>
          <div className="text-container">
            <div className="profile-header">
              <img
                src="https://via.placeholder.com/50"
                alt="Profile"
                className="profile-pic"
              />
              <div className="profile-details">
                <p style={{ marginBottom: "5px" }}>hoamsy</p>
              </div>
            </div>
            <div className="content">
              <h4 style={{ marginBottom: "20px", marginTop: "20px" }}>
                <strong>
                  10 Things to Do in Boston and Around Mass for This Week
                </strong>
              </h4>
              <p style={{ lineHeight: 1.4, marginBottom: "20px" }}>
                If you're looking for things to do in Boston or around Mass,
                here are 10 unique experiences we have coming up to get yourself
                outdoors 🌸
              </p>
              <p style={{ lineHeight: 1.4, marginBottom: "20px" }}>
                P.S. All experiences have multiple dates. You can get more info
                and book tix on Hoamsy (via our bio).
              </p>
              <ul style={{ lineHeight: 1.4 }}>
                <li style={{ marginBottom: "20px" }}>June 14th: </li>
                <li>Cool Candle Making over Brews, Long Live Boston</li>
                <li style={{ marginBottom: "20px" }}>
                  Learn Dumpling Making, Cambridge MA
                </li>
                <li style={{ marginBottom: "20px" }}>June 15th: </li>
                <li>
                  Custom Perfume Making Workshop, Rooting For You, Cambridge MA
                </li>
                <li>Foraging Walk + Wild Food Picnic, Waltham MA</li>
                <li>Make A Candle Garden, Long Live Boston</li>
                <li>Summer Boating Trip, Marshfield MA</li>
                <li>Pottery Workshop: Make A Clay Serving Bowl, Newton MA</li>
                <li style={{ marginBottom: "20px" }}>
                  Yoga On The Beach, Pleasure Bay Boston
                </li>
                <li style={{ marginBottom: "20px" }}>June 16th: </li>
                <li>Vintage Cake Decorating Workshop, Long Live Boston</li>
                <li style={{ marginBottom: "20px" }}>
                  Pottery: Make A Mosaic Trivet, Newton MA
                </li>
              </ul>
              <p style={{ fontSize: "12px", color: "#888" }}> {datePosted}</p>
            </div>
            <div className="footer">
              <button className="icon-button" onClick={handleLike}>
                {liked ? (
                  <svg fill="red" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg
                    fill="none"
                    stroke="black"
                    strokeWidth="1.25"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                )}
                <span>{likesCount}</span>
              </button>
              <button className="icon-button" onClick={handleFavorite}>
                {favorited ? (
                  <svg
                    fill="#FFD700"
                    viewBox="2 2 20 20"
                    style={{ transform: "scale(1.15)" }}
                  >
                    <path d="M12 17.27l5.5 3.23-1.47-6.17L21 9.54l-6.24-0.54L12 3l-2.76 6-6.24 0.54 4.71 4.79L6.5 20.5 12 17.27z" />
                  </svg>
                ) : (
                  <svg
                    fill="none"
                    stroke="black"
                    strokeWidth="1.25"
                    viewBox="0 0 24 24"
                    style={{ transform: "scale(1.15)" }}
                  >
                    <path d="M12 17.27l5.5 3.23-1.47-6.17L21 9.54l-6.24-0.54L12 3l-2.76 6-6.24 0.54 4.71 4.79L6.5 20.5 12 17.27z" />
                  </svg>
                )}
                <span>{favoritesCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        .post-container {
          display: flex;
          justify-content: center;
          padding: 20px;
        }
        .card {
          width: 100%;
          max-width: 600px;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .image-container {
          position: relative;
        }
        .main-image {
          width: 100%;
          height: auto;
        }
        .navigation {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          transform: translateY(-50%);
        }
        .nav-button {
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          padding: 10px;
          cursor: pointer;
        }
        .image-index {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 5px;
          border-radius: 5px;
        }
        .text-container {
          padding: 20px;
        }
        .profile-header {
          display: flex;
          align-items: center;
        }
        .profile-pic {
          border-radius: 50%;
          margin-right: 10px;
        }
        .content h4 {
          margin: 0;
        }
        .content ul {
          padding-left: 20px;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        .icon-button {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
        }
        .icon-button svg {
          margin-right: 5px;
        }
      `}</style>
    </>
  );
};

export default Post;
