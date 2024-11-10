import React, { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import GroupAddForm from "../components/GroupAddForm.jsx";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import AxiosInstance from "@/axios/axiosInstance.js";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx";
import { SquareLoader } from "react-spinners";

function Group() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]); // State to store groups
  const [search, setSearch] = useState("");
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const navigate = useNavigate();

  const handleGroupClick = () => {
    navigate("/group-chat"); // Navigates to GroupChat page
  };

  // Function to handle adding a new group
  const addGroup = (newGroup) => {
    setGroups([...groups, newGroup]);
    closeModal();
  };

  const groupQuery = useQuery({
    queryKey: ["group"],
    queryFn: async () => {
      const data = await AxiosInstance.get("/group/groups");
      return data.data.data;
    },
  });

  const searchQuery = useQuery({
    queryKey: ["search"],
    queryFn: async (searchTerm) => {
      const data = await AxiosInstance.get(`/group/search?search=${search}`);
      return data.data.data;
    },
  });

  console.log(groupQuery.data);

  return (
    <div className="">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchQuery.refetch(search);
        }}
        class="mt-2 max-w-md mx-auto"
      >
        <label
          for="default-search"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            id="default-search"
            class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Mockups, Logos..."
          />
          {searchQuery.isPending ? (
            <div
              type="submit"
              class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <SquareLoader />
            </div>
          ) : (
            <button
              type="submit"
              class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          )}
        </div>
      </form>

      <div className="w-[80%] m-auto flex justify-end ">
        <button
          className="px-4 bg-slate-500 py-2 rounded-md mt-4 text-slate-50"
          onClick={openModal}
        >
          Add Group
        </button>
      </div>

      <Modal open={isModalOpen} onClose={closeModal} center>
        <GroupAddForm onClose={closeModal} onAddGroup={addGroup} />{" "}
        {/* Pass addGroup as prop */}
      </Modal>
      <div className="flex justify-center">
        <div className="flex flex-wrap container  mt-10">
          {searchQuery?.data?.map((group, index) => (
            <div key={index} className="p-4 max-w-sm">
              <Link to={"/group-chat" + "/" + group._id}>
                <div className="flex rounded-lg h-full dark:bg-gray-800 bg-gray-500 p-8 flex-col">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-32 w-32 rounded">
                      <AvatarImage
                        src={group.image || "https://github.com/shadcn.png"}
                      />
                    </Avatar>
                    <h1 className="font-bold text-white text-xl">
                      {group.name}
                    </h1>
                  </div>

                  <div className="flex flex-col justify-between flex-grow">
                    <p className=" text-white dark:text-gray-300">
                      {group.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-300">
                      Members: {group.user.length + group.admin_users.length}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Group;
