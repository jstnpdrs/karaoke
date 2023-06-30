"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Databases, Query } from "appwrite";
import { client, databaseID, queue, rooms } from "../../../config";

export default function Monitor({ params }) {
  const databases = new Databases(client);
  const playerRef = useRef(null);
  const router = useRouter();
  const [videoId, setVideoId] = useState("");
  const [videoKey, setVideoKey] = useState("");
  // const [videoId, setVideoId] = useState("BBQGZroXr-A");
  useEffect(() => {
    if (videoId) {
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
    }

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, [videoId]);

  const handlePlayerStateChange = async (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      // alert("Video ended");
      // setVideoId("aSlK3GhRuXA");
      // alert(videoId);

      await databases
        .listDocuments(databaseID, queue, [
          Query.equal("roomNumber", parseInt(params.roomNumber)),
        ])
        .then(
          async function (response) {
            console.log(response); // Success
            if (response.total) {
              await databases
                .deleteDocument(databaseID, queue, response.documents[0].$id)
                .then(
                  function (response) {
                    console.log(response); // Success
                  },
                  function (error) {
                    console.log(error); // Failure
                  }
                );
              setVideoKey(response.documents[1]?.$id);
              setVideoId(response.documents[1]?.videoId);
              // alert(response.documents[0].$id);
            } else {
              alert("No Video Found");
            }
          },
          function (error) {
            console.log(error); // Failure
          }
        );
      // deleteVideo();
      // await getVideo();
      // after video ends,
      // delete current video from db and get next video
    }
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  // useEffect(() => {
  //   getVideo();
  // }, []);

  async function nextVideo() {
    // alert(videoKey);
    await databases.deleteDocument(databaseID, queue, videoKey).then(
      async function (response) {
        console.log(response); // Success
        await getVideo();
      },
      async function (error) {
        await getVideo();
        // console.log(error); // Failure
      }
    );
  }
  async function getVideo() {
    const getVid = await databases
      .listDocuments(databaseID, queue, [
        Query.equal("roomNumber", parseInt(params.roomNumber)),
      ])
      .then(
        function (response) {
          console.log(response); // Success
          if (response.total) {
            setVideoKey(response.documents[0].$id);
            setVideoId(response.documents[0].videoId);
          } else {
            alert("No Video Found");
          }
        },
        function (error) {
          console.log(error); // Failure
        }
      );
  }
  return (
    <div className="p-5 sm:p-10">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4945522729831776"
          crossorigin="anonymous"
        ></script>
      </head>
      <h1 className="flex-none pb-2 tracking-wider text-center text-gray-300 uppercase">
        Room Number:{" "}
        <span className="font-bold tracking-widest">{params.roomNumber}</span>
      </h1>
      <div
        id="player"
        className="flex w-full min-h-[400px] border-2 border-red-600 shadow rounded-xl shadow-red-800"
      >
        {!videoId && (
          <>
            <button
              onClick={getVideo}
              className="w-56 h-56 p-5 m-auto text-xl text-center uppercase border-2 border-green-500 rounded-full shadow animate-pulse shadow-green-400"
            >
              <div class="translate-x-3 translate-y-3 w-0 h-0 m-auto border-t-[50px] border-t-transparent border-l-[75px] border-l-green-500 border-b-[50px] border-b-transparent"></div>
              <p className="mt-1 text-center text-gray-300 translate-y-4">
                load queue
              </p>
            </button>
          </>
        )}
      </div>
      {/* {videoKey} : {videoId} */}
      {videoId && (
        <button
          onClick={nextVideo}
          className="w-full p-5 mt-10 text-xl text-center border-2 border-yellow-500 shadow shadow-yellow-400 rounded-xl"
        >
          Next
        </button>
      )}
      <div className="grid w-full grid-cols-2 gap-4 py-5">
        <button
          onClick={() => router.back()}
          className="p-3 text-xl text-center border-2 border-gray-500 shadow shadow-gray-400 rounded-xl"
        >
          Back
        </button>
        <a
          href={``}
          className="p-3 text-xl text-center border-2 border-blue-500 shadow shadow-blue-400 rounded-xl"
        >
          Refresh
        </a>
      </div>
    </div>
  );
}
