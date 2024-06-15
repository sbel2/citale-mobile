"use client";

import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import styles from "./globals.css";

const Home = () => {
  useEffect(() => {
    const fetchImageData = async () => {
      let page = 1;
      let fetching = false;
      const container = document.getElementById("container");
      const cols = Array.from(container.getElementsByClassName("col"));

      const fetchData = async () => {
        try {
          fetching = true;
          document.getElementById("loader").style.display = "block";
          const response = await fetch(`https://dog.ceo/api/breeds/image/random/30`);
          const data = await response.json();
          fetching = false;
          return data.message;
        } catch (error) {
          console.error("Error fetching data:", error);
          fetching = false;
          throw error;
        }
      };

      const createCard = (image, col) => {
        const card = document.createElement("div");
        card.classList.add("card");
      
        const link = document.createElement("a");
        link.href = `/post/${encodeURIComponent(image)}`; // Ensure this points to /post/[id]
        link.classList.add("card-link");
      
        const img = document.createElement("img");
        img.src = image;
        img.alt = "dog pics";
        img.style.width = "100%";
        img.onerror = function () {
          this.parentElement.style.display = "none";
        };
        img.onload = function () {
          document.getElementById("loader").style.display = "none";
        };
      
        link.appendChild(img);
        card.appendChild(link);
        col.appendChild(card);
      };

      const handleScroll = () => {
        if (fetching) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const bodyHeight = document.documentElement.scrollHeight;

        if (bodyHeight - scrollTop - windowHeight < 800) {
          page++;
          fetchData()
            .then((images) => {
              if (images.length > 0) {
                images.forEach((image, index) => {
                  createCard(image, cols[index % cols.length]);
                });
              }
            })
            .catch((error) => {
              console.error("Error handling scroll:", error);
            });
        }
      };

      fetchData()
        .then((images) => {
          if (images.length > 0) {
            images.forEach((image, index) => {
              createCard(image, cols[index % cols.length]);
            });
          }
        })
        .catch((error) => {
          console.error("Error initial fetch:", error);
        });

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    };

    fetchImageData();
  }, []);

  return (
    <>
      <Head>
        <title>Cue-up</title>
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <nav>
        <a className="logo" href="#">
          <i className="INSERT LOGO HERE LATER"></i>
        </a>
        <input type="text" className="search" placeholder="Search" />
      </nav>
      <div id="loader"></div>
      <div id="container">
        <div className="col"></div>
        <div className="col"></div>
        <div className="col"></div>
        <div className="col"></div>
        <div className="col"></div>
      </div>
      <Script src="/script.js" strategy="lazyOnload" />
    </>
  );
};

export default Home;
