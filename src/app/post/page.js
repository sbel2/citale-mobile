'use client';

import { useEffect, useState } from "react";
import Head from "next/head";

const Post = () => {
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState(false);
  const [likes, setLikes] = useState(0);


  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://dog.ceo/api/breeds/image/random/1`);
        const data = await response.json();
        setImageData(data.message[0]);
        console.log("Fetched Image:", data.message[0]); // Log the fetched image
      } catch (error) {
        console.error("Error fetching image:", error);
        setError(true);
      }
    };

    fetchImage(); // Fetch the image when the component mounts
  }, []);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  if (error) {
    return <div>Error loading post. Please try again later.</div>;
  }

  if (!imageData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Post Detail</title>
      </Head>
      <div className="post-container">
        <div className={`card`}>
          <div className="image-container">
            <img src={imageData} alt="Post Image" className="main-image" />
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
            </div>
            <div className="footer">
              <button className="like-button" onClick={handleLike}>
                ❤️ Like {likes}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .post-container {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f0f0f0;
          padding: 20px;
          height: 120vh;
          backdrop-filter: blur(10px);
          overflow-y: hidden;
        }
        .card {
          display: flex;
          background: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          overflow: hidden;
          width: 100%;
          max-width:1000px;
          height: 80%;
        }

        .image-container {
          flex: 1.5;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .image-container img {
          max-width: 100%;
          max-height: 100%;
          object-fit: cover;
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
          box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.1); /* Adjusted shadow for bottom only */
        }
        .profile-pic {
          border-radius: 30%;
          width: 40px;
          height: 40px;
          margin-right: 10px;
          margin-bottom: 10px;
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
          margin-top: 10px;
          box-shadow: 0 -2px 2px -2px rgba(0, 0, 0, 0.1); 
        }
        .like-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        .like-button:hover {
          background: #0056b3;
        }
      `}</style>
    </>
  );
};

export default Post;
