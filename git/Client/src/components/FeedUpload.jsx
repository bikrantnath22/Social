import AxiosInstance from "@/axios/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { Axios } from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function FeedUpload({ onClose, onAddFeed }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const createPostMutation = useMutation({
    mutationFn: async (postData) => {
      await AxiosInstance.post("/user/post", postData);
    },
    onSuccess: () => {
      toast.success("Post created successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: () => {
      setMessage("An error occurred. During post creation!");
      toast.error("An error occurred. During post creation!");
    },
  });
  const imageUploadMutation = useMutation({
    mutationFn: async (image) => {
      if (!image) return "";
      const formData = new FormData();
      formData.append("file", image);
      const data = await AxiosInstance.post("/file/nsfw/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.data;
    },
    onSuccess: (data) => {
      console.log(data);
      createPostMutation.mutate({
        title,
        description,
        image: data.data || "",
        user: localStorage.getItem("userId"),
      });
    },
    onError: (error) => {
      setMessage("An error occurred. During image upload!");
      toast.error(
        error?.response?.data?.message ||
          "An error occurred. During image upload!"
      );
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    imageUploadMutation.mutate(image);
  };
  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="mx-auto w-full max-w-[550px] bg-white">
          <form onSubmit={handleSubmit} className="py-4 px-9">
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Title
              </label>
              <input
                required
                name="name"
                type="text"
                placeholder=""
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Description
              </label>
              <input
                type="name"
                name="name"
                required
                onChange={(e) => setDescription(e.target.value)}
                placeholder=""
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            {image ? (
              <div>
                <img
                  className="w-full h-[350px] object-contain"
                  src={URL.createObjectURL(image)}
                />
              </div>
            ) : (
              <div className="mb-6 pt-4">
                <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                  Upload File
                </label>

                <div className="mb-8">
                  <input
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const allowedTypes = ["image/jpeg", "image/png"];
                      if (file && allowedTypes.includes(file.type)) {
                        // File type is valid
                        setImage(file);
                        // You can handle the valid file here (e.g., upload or display preview)
                      }
                    }}
                    type="file"
                    name="file"
                    id="file"
                    className="sr-only"
                  />
                  <label
                    for="file"
                    className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                  >
                    <div>
                      <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                        Drop files here
                      </span>
                      <span className="mb-2 block text-base font-medium text-[#6B7280]">
                        Or
                      </span>
                      <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                        Browse
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div>
              <button className="mt-2 hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
                Upload post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
