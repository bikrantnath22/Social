import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AxiosInstance from "@/axios/axiosInstance";
export default function ImageComponents({ onClose }) {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const sendMessageMutation = useMutation({
    mutationFn: async (postData) => {
      await AxiosInstance.post("/group/send-message/" + id, postData);
    },
    onSuccess: () => {
      toast.success("Image sent successfully!");
      setTimeout(() => {
        onClose();
      }, 500);
    },
    onError: () => {
      toast.error("An error occurred. During post creation!");
    },
  });
  const imageUploadMutation = useMutation({
    mutationFn: async (image) => {
      if (!image) return "";
      const formData = new FormData();
      formData.append("file", image);
      const data = await AxiosInstance.post("/file/upload/image", formData, {
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
        media_type: "image",
        media_url: data.data || "",
      });
    },
    onError: () => {
      toast.error("An error occurred. During image upload!");
    },
  });

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!image) {
      return toast.error("Please select an image");
    }
    imageUploadMutation.mutate(image);
  }

  return (
    <div>
      <form
        onSubmit={handleSendMessage}
        className="flex flex-col justify-center items-center"
      >
        <Avatar className="h-32 w-32">
          <AvatarImage
            src={
              image
                ? URL.createObjectURL(image)
                : "https://th.bing.com/th/id/R.7e6f16a006711b370c53f50bc69e4ccb?rik=7Afd%2f65YHCwLgQ&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_197311.png&ehk=%2f%2bedqpv8dJFCzMm5dULib%2fsrjtlhKZmLFfzHVo5w9pQ%3d&risl=&pid=ImgRaw&r=0"
            }
            alt="@shadcn"
          />
        </Avatar>

        <div class="">
          <div class="container mt-2 flex flex-col justify-center items-center">
            <div id="images-container"></div>
            <div class="flex flex-col w-full justify-center">
              <div id="multi-upload-button" class="">
                <input
                  onChange={(event) => setImage(event.target.files[0])}
                  class="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="default_size"
                  type="file"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Caption
                </label>

                <input
                  type="text"
                  required
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <input
              type="file"
              id="multi-upload-input"
              class="hidden"
              multiple
            />
          </div>
          <div className="flex justify-end mt-2">
            <button className="px-4 bg-stone-700 text-white rounded">
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
