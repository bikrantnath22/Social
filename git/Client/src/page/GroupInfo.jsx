import AxiosInstance from "@/axios/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function GroupInfo() {
  const { id } = useParams();
  const group = useQuery({
    queryKey: ["group", id],
    queryFn: fetchGroup,
  });
  async function fetchGroup() {
    try {
      const response = await AxiosInstance.get("/group/" + id);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  } 
  console.log('hii');
  async function enrollGroup() {
    try {
      const response = await AxiosInstance.post("/group/enroll/" + id);
      if (response.status == 200) {
        toast.success("Enrolled into group");
        group.refetch();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to enroll into group");
    }
  }
  console.log(group);
  useEffect(() => {
    fetchGroup();
  }, []);

  return (
    <div className="flex items-center justify-center p-20">
      <div className="flex rounded-lg h-full  dark:bg-gray-800 w-[500px] bg-teal-400 p-8 flex-col">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={group?.data?.image || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="font-semibold text-white text-xl">{group?.name}</h1>
        </div>

        <div className="flex flex-col justify-between flex-grow">
          <p className="leading-relaxed text-base text-white dark:text-gray-300">
            {group?.data?.description}
          </p>
          <p className="mt-2 text-sm text-indigo-500 font-semibold">
            Members:{" "}
            {group?.data?.user?.length + group?.data?.admin_users?.length}
          </p>
          {group?.data?.request?.find(
            (obj) => obj._id == localStorage.getItem("userId")
          ) ? (
            <p className="mt-2 rounded-md p-2 text-center text-white bg-indigo-400 text-sm text-indigo-500 font-semibold">
              Requested
            </p>
          ) : (
            <Button className="mt-6" onClick={enrollGroup}>
              Enroll
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
