import Image from "next/image";
import Link from "next/link";

export default function Page({ params }) {
  return (
    <div className="flex w-full h-screen text-center">
      <div className="flex flex-col gap-5 m-auto">
        <Image src="/karaokegif.gif" alt="me" width="224" height="224" />

        <h1 className="text-lg tracking-wider uppercase">
          Room Number:{" "}
          <span className="font-bold tracking-widest">{params.roomNumber}</span>
        </h1>
        <a
          href={"/monitor/" + params.roomNumber}
          className="w-56 p-2 text-xl tracking-wider text-purple-100 border-2 border-purple-600 shadow rounded-xl shadow-purple-500"
        >
          Monitor
        </a>
        <Link
          href={"/controller/" + params.roomNumber}
          className="w-56 p-2 text-xl tracking-wider text-orange-100 border-2 border-orange-500 shadow rounded-xl shadow-orange-500"
        >
          Controller
        </Link>
        <Link
          href="/"
          className="w-56 p-2 mt-10 text-xl tracking-wider text-red-100 border-2 border-red-500 shadow rounded-xl shadow-red-500"
        >
          Exit
        </Link>
      </div>
    </div>
  );
}
