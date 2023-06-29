"use client";
import Link from "next/link";
import songs2 from "../../../data/karaokeytv.json";
import { Databases, Query, ID } from "appwrite";
import { client, databaseID, queue } from "../../../config";

export default function Controller({ params }) {
  const songs = songs2;
  const databases = new Databases(client);

  async function addToQueue(videoId, title) {
    const conf = confirm("Add (" + title + ") to queue?");
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
  return (
    <div className="flex w-full text-center relative">
      <div className="flex flex-col gap-5 mt-5 mx-auto px-3">
        <div className="w-full flex gap-5 items-center">
          <Link
            href={"/home/" + params.roomNumber}
            className=" px-3 tracking-wider text-red-100 border-2 border-red-500 shadow rounded-xl shadow-red-500"
          >
            Back
          </Link>
          <h1 className="text-lg tracking-wider uppercase flex-none">
            Room Number:{" "}
            <span className="font-bold tracking-widest">
              {params.roomNumber}
            </span>
          </h1>
        </div>
        <input
          type="text"
          name="search"
          id="search"
          className="sticky top-0 bg-black w-full p-2 mb-2 text-xl tracking-wider text-center border-2 shadow text-slate-100 border-slate-400 rounded-xl shadow-slate-300"
          placeholder="Search Songs"
          autoComplete="off"
        />
        <div className="w-full flex flex-col pb-10">
          {songs.map((item) => {
            return (
              <p
                onClick={() => addToQueue(item.videoId, item.title)}
                key={"vid" + item.videoId}
                className="cursor-pointer py-2 hover:bg-slate-800 text-left uppercase text-xs text-gray-300 tracking-widest"
              >
                {item.title}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
