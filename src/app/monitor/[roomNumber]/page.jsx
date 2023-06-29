"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Monitor() {
  const playerRef = useRef(null);
  const router = useRouter();
  // const [videoId, setVideoId] = useState("");
  const [videoId, setVideoId] = useState("BBQGZroXr-A");
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("player", {
        videoId: videoId,
        playerVars: {
          rel: 0,
          // controls: 0,
          modestbranding: 0,
        },
        events: {
          onStateChange: handlePlayerStateChange,
        },
      });
    };

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, [videoId]);

  const handlePlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      // alert("Video ended");
      setVideoId("aSlK3GhRuXA");
      // after video ends,
      // delete current video from db and get next video
    }
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  return (
    <div className="px-5 sm:px-10">
      <div className="grid w-full grid-cols-2 gap-4 py-5">
        <button
          onClick={() => router.back()}
          className="p-5 text-xl text-center border-2 border-gray-500 shadow shadow-gray-400 rounded-xl"
        >
          Back
        </button>
        <a
          href={``}
          className="p-5 text-xl text-center border-2 border-blue-500 shadow shadow-blue-400 rounded-xl"
        >
          Refresh
        </a>
      </div>
      <div
        id="player"
        className="w-full min-h-[400px] border-2 border-red-600 shadow rounded-xl shadow-red-800"
      ></div>
    </div>
  );
}
