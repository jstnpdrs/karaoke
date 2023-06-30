"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import songs from "../../../data/songs.json";
import { Databases, Query, ID } from "appwrite";
import { client, databaseID, queue } from "../../../config";

export default function Controller({ params }) {
  const [query, setQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const databases = new Databases(client);

  useEffect(() => {
    // const timer = setTimeout(() => {
    const filteredData = songs.filter(
      (item) =>
        item.title && item.title.toLowerCase().includes(query.toLowerCase())
    );
    const sortedData = filteredData.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setFilteredSongs(sortedData);
    // }, 500); // 2-second delay

    // return () => clearTimeout(timer);
  }, [query]);

  async function addToQueue(videoId, title) {
    const conf = confirm('Add "' + title + '" to queue?');
    if (conf) {
      await databases
        .createDocument(databaseID, queue, ID.unique(), {
          roomNumber: params.roomNumber,
          videoId: videoId,
          title: title,
        })
        .then(
          function (response) {
            console.log(response); // Success

            response.$id
              ? alert("Added to Queue")
              : alert("Something went wrong. Please try again.");
            // setJoinRoom(false);
          },
          function (error) {
            console.log(error); // Failure
          }
        );
    }
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="relative flex w-full text-center">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4945522729831776"
          crossorigin="anonymous"
        ></script>
      </head>
      <div className="flex flex-col gap-5 px-3 mx-auto mt-5 w-80">
        <div className="flex items-center gap-5">
          <Link
            href={"/home/" + params.roomNumber}
            className="px-3 tracking-wider text-red-100 border-2 border-red-500 shadow rounded-xl shadow-red-500"
          >
            Back
          </Link>
          <h1 className="flex-none tracking-wider uppercase">
            Room Number:{" "}
            <span className="font-bold tracking-widest">
              {params.roomNumber}
            </span>
          </h1>
        </div>
        <div className="sticky top-0 bg-black">
          <input
            value={query}
            onChange={handleInputChange}
            type="text"
            name="search"
            id="search"
            className="w-full p-2 mb-2 text-xl tracking-wider text-center bg-transparent border-2 shadow text-slate-100 border-slate-400 rounded-xl shadow-slate-300"
            placeholder="Search Songs"
            autoComplete="off"
          />
          <p className="text-[8px] text-right tracking-widest pr-2">
            TOTAL RESULT :{" "}
            <span className="text-[10px]">{filteredSongs.length}</span>
          </p>
        </div>
        <div className="flex flex-col w-full pb-10">
          {filteredSongs.map((item, i) => {
            return (
              <div
                key={"vid" + i}
                className="py-2 text-xs tracking-widest text-left text-gray-300 uppercase cursor-pointer hover:bg-slate-800"
              >
                <p
                  onClick={() => addToQueue(item.videoId, item.title)}

                  // className="py-2 text-xs tracking-widest text-left text-gray-300 uppercase cursor-pointer hover:bg-slate-800"
                >
                  {item.title}
                </p>
                <p className="text-[8px] text-left">{item.channelTitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
