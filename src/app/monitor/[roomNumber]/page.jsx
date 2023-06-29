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
              setVideoKey(response.documents[1].$id);
              setVideoId(response.documents[1].videoId);
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

  function deleteVideo() {
    databases.deleteDocument(databaseID, queue, videoKey).then(
      function (response) {
        console.log(response); // Success
      },
      function (error) {
        console.log(error); // Failure
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
      {videoKey} : {videoId}
      <button
        onClick={getVideo}
        // onClick={async () => {
        // await databases.deleteDocument(databaseID, queue, videoKey).then(
        // function (response) {
        // console.log(response); // Success
        // },
        // function (error) {
        // console.log(error); // Failure
        // }
        // );
        // }}
        className="p-5 text-xl w-full mt-10 text-center border-2 border-yellow-500 shadow shadow-yellow-400 rounded-xl"
      >
        Next
      </button>
    </div>
  );
}
