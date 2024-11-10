import React, { useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import "rsuite/DatePicker/styles/index.css";
import DatePicker from "rsuite/DatePicker";
import AxiosInstance from "@/axios/axiosInstance";
import { isBefore, isSameDay } from "date-fns";
const AddEvent = () => {
  const [image, setImage] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const ref = useRef();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    if (file && allowedTypes.includes(file.type)) {
      // File type is valid
      setImage(file);
      // You can handle the valid file here (e.g., upload or display preview)
    }
    console.log("Selected file:", file);
    // You can also process the file here, e.g., upload to a server
  };
  const createEventMutation = useMutation({
    mutationFn: async (postData) => {
      await AxiosInstance.post("/event/create", postData);
    },
    onSuccess: () => {
      toast.success("Event created successfully!");
      // setTimeout(() => {
      //   window.location.reload();
      // }, 500);
    },
    onError: () => {
      toast.error("An error occurred. During post creation!");
    },
  });
  const imageUploadMutation = useMutation({
    mutationFn: async (image) => {
      if (!image) return "";
      console.log("hello");
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
      createEventMutation.mutate({
        title,
        description,
        image: data.data || "",
        start_date: startDate,
        end_date: endDate,
      });
    },
    onError: () => {
      toast.error("An error occurred. During image upload!");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      return toast.error("Please select start and end date");
    }
    //end_date, start_end
    if (isBefore(endDate, startDate)) {
      return toast.error("End date must be after start date");
    }

    imageUploadMutation.mutate(image);
  };
  return (
    <div className="md:absolute md:left-72 w-[400px]">
      <div className=" ">
        <div className="">
          <input
            type="file"
            className="hidden"
            ref={ref}
            onChange={handleFileChange}
          />
          <h2 className="text-xl font-bold text-center mb-4">Add New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center">
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
            </div>
            <div>
              <div class="w-full  bg-white">
                <div class="container mx-auto flex flex-col justify-center items-center">
                  <div id="images-container"></div>
                  <div class="flex w-full justify-center  ">
                    <div
                      onClick={() => ref.current.click()}
                      id="multi-upload-button"
                      class="inline-flex items-center px-4 py-2 bg-gray-600 border border-gray-600 rounded-l font-semibold cursor-pointer text-sm text-white tracking-widest hover:bg-gray-500 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition "
                    >
                      Click to browse
                    </div>
                    <div class="w-4/12 lg:w-3/12 border border-gray-300 rounded-r-md flex items-center justify-between">
                      <span id="multi-upload-text" class="p-2"></span>
                      <button
                        id="multi-upload-delete"
                        class="hidden"
                        onclick="removeMultiUpload()"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="fill-current text-red-700 w-3 h-3"
                          viewBox="0 0 320 512"
                        >
                          <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start date:
              </label>
              <DatePicker onChange={setStartDate} format="MM/dd/yyyy HH:mm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End date:
              </label>
              <DatePicker onChange={setEndDate} format="MM/dd/yyyy HH:mm" />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Event Title:
              </label>

              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                required
                className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description:
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
              Add Group
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
