"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Databases, ID } from "appwrite";
import { client, databaseID, rooms } from "../config";
import Image from "next/image";

export default function Home() {
  const databases = new Databases(client);

  const router = useRouter();
  const [createRoom, setCreateRoom] = useState(false);

  async function newRoom() {
    const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const promise = databases.createDocument(databaseID, rooms, ID.unique(), {
      roomNumber: randomNum,
    });
    promise.then(
      function (response) {
        console.log(response); // Success
        // setCreateRoom(false);
        router.push(`/home/${randomNum}`);
        // alert("room created");
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  }

  useEffect(() => {
    if (createRoom) {
      const interval = setInterval(async () => {
        newRoom();
        // setCreateRoom(false);
      }, 2000);
      return () => clearInterval(interval);
    }
    return;
  }, [createRoom]);

  if (createRoom) {
    return (
      <div className="flex w-full h-screen text-center">
        <div className="m-auto animate-bounce">
          <h1>CREATING ROOM . . .</h1>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex w-full h-screen text-center">
        <head>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4945522729831776"
            crossorigin="anonymous"
          ></script>
        </head>
        <div className="flex flex-col w-56 gap-5 m-auto">
          {/* <iframe
            src="https://gifer.com/embed/73hw"
            width={224}
            height={224}
            frameBorder="0"
            allowFullScreen
          ></iframe> */}
          <Image src="/karaokegif.gif" alt="me" width="224" height="224" />
          <button
            // onClick={newRoom}
            onClick={() => setCreateRoom(true)}
            className="w-56 p-2 text-xl tracking-wider text-purple-100 border-2 border-purple-600 shadow rounded-xl shadow-purple-500"
          >
            Create Room
          </button>
          <Link
            href="/join"
            className="w-56 p-2 text-xl tracking-wider text-orange-100 border-2 border-orange-500 shadow rounded-xl shadow-orange-500"
          >
            Join Room
          </Link>
        </div>
      </div>
    );
  }
}
