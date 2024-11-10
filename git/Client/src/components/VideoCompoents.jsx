import AxiosInstance from "@/axios/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { ClockLoader } from "react-spinners";
const VideoCompoents = ({ onClose }) => {
  const [videoUrl, setVideoUrl] = useState(
    "https://www.w3schools.com/html/mov_bbb.mp4"
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8); // Default volume at 80%
  const [progress, setProgress] = useState(0);
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState("");
  const sendMessageMutation = useMutation({
    mutationFn: async (postData) => {
      await AxiosInstance.post("/group/send-message/" + id, postData);
    },
    onSuccess: () => {
      toast.success("Video sent successfully!");
      setTimeout(() => {
        onClose();
      }, 500);
    },
    onError: () => {
      toast.error("An error occurred. During video upload!");
    },
  });
  const videoUploadMutation = useMutation({
    mutationFn: async (image) => {
      if (!image) return "";
      const formData = new FormData();
      formData.append("file", image);
      const data = await AxiosInstance.post("/file/upload/video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.data;
    },
    onSuccess: (data) => {
      console.log(data);
      sendMessageMutation.mutate({
        message: caption,
        username: localStorage.getItem("username"),
        media_type: "video",
        media_url: data.data || "",
      });
    },
    onError: () => {
      toast.error("An error occurred. During video upload!");
    },
  });

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!video) {
      return toast.error("Please select a video");
    }
    videoUploadMutation.mutate(video);
  }
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleProgress = (state) => {
    setProgress(state.played * 100);
  };
  return (
    <div className="flex space-x-4">
      <div className="max-w-lg mx-auto p-4 bg-gray-800 text-white rounded-lg shadow-lg">
        <ReactPlayer
          url={videoUrl}
          playing={isPlaying}
          volume={volume}
          onProgress={handleProgress}
          width="100%"
          height="150px"
          className="rounded-lg"
        />

        {/* Controls */}
        <div className="mt-4 flex flex-col items-center">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            className="w-full my-2 accent-blue-500"
          />

          {/* Volume Control */}
          <label className="w-full text-sm text-gray-300">
            Volume
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-blue-500"
            />
          </label>
        </div>
      </div>
      <form onSubmit={handleSendMessage} class="">
        <div class="container mt-2 flex flex-col justify-center items-center">
          <div id="images-container"></div>
          <div class="flex flex-col w-full justify-center">
            <div id="multi-upload-button" class="">
              <input
                class="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="default_size"
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const videoFile = e.target.files[0];
                  setVideo(videoFile);
                  setVideoUrl(URL.createObjectURL(videoFile));
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Caption
              </label>

              <input
                type="text"
                required
                onChange={(e) => {
                  setCaption(e.target.value);
                }}
                className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <input type="file" id="multi-upload-input" class="hidden" multiple />
        </div>
        {videoUploadMutation?.isPending || sendMessageMutation?.isPending ? (
          <ClockLoader />
        ) : (
          <div className="flex justify-end mt-2">
            <button className="px-4 bg-stone-700 text-white rounded">
              Send
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default VideoCompoents;
