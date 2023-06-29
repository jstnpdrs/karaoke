"use client";
import Link from "next/link";
import { Databases, Query } from "appwrite";
import { client, databaseID, rooms } from "../../config";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Join() {
  const databases = new Databases(client);
  const router = useRouter();
  // =======================================
  const [joinRoom, setJoinRoom] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");

  async function findRoom(e) {
    e.preventDefault();

    const getRoom = await databases
      .listDocuments(databaseID, rooms, [
        Query.equal("roomNumber", parseInt(roomNumber)),
      ])
      .then(
        function (response) {
          console.log(response); // Success

          response.total
            ? router.push(`/home/${roomNumber}`)
            : alert("room not found");
          // setJoinRoom(false);
        },
        function (error) {
          console.log(error); // Failure
        }
      );
  }

  // =======================================
  return (
    <div className="flex w-full h-screen text-center">
      <div className="flex flex-col gap-5 m-auto">
        <form onSubmit={findRoom} className="flex flex-col gap-5 m-auto">
          <input
            type="number"
            min={1000}
            max={9999}
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            name="roomNumber"
            id="roomNumber"
            className="w-56 p-2 mb-2 text-xl tracking-wider text-center bg-transparent border-2 shadow text-slate-100 border-slate-400 rounded-xl shadow-slate-300"
            placeholder="Enter Room ID"
            autoFocus
          />
          <button
            // onClick={findRoom}
            className="w-56 p-2 text-xl tracking-wider text-blue-100 border-2 border-blue-600 shadow rounded-xl shadow-blue-500"
          >
            Join Room
          </button>
        </form>
        <Link
          href={"/"}
          className="w-56 p-2 text-xl tracking-wider text-red-200 border-2 border-red-800 shadow rounded-xl shadow-red-600"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
