import AxiosInstance from "@/axios/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function FileComponents({onClose}) {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const sendMessageMutation = useMutation({
    mutationFn: async (postData) => {
      await AxiosInstance.post("/group/send-message/" + id, postData);
    },
    onSuccess: () => {
      toast.success("Document sent successfully!");
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
      const data = await AxiosInstance.post("/file/upload/document", formData, {
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
        media_type: "doc",
        media_url: data.data || "",
      });
    },
    onError: () => {
      toast.error("An error occurred. During document upload!");
    },
  });

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!image) {
      return toast.error("Please select a document");
    }
    imageUploadMutation.mutate(image);
  }
  return (
    <form onSubmit={handleSendMessage}>
      <div className=" ">
        <div class="">
          <div class="container mt-2 flex flex-col justify-center items-center">
            <div id="images-container"></div>
            <div class="flex flex-col w-full justify-center">
              <div id="multi-upload-button" class="">
                <input
                  accept="application/pdf"
                  class="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="default_size"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Caption
                </label>

                <input
                  type="text"
                  onChange={(e) => setCaption(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button className="px-4 bg-stone-700 text-white rounded">
              Send
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
