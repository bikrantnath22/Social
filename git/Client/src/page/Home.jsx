import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import FeedUpload from "../components/FeedUpload";
import CardPost from "../components/CardPost";
import AxiosInstance from "@/axios/axiosInstance";
import PocketBase from "pocketbase";
const pb = new PocketBase("http://127.0.0.1:8090");
import { Link } from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";

import BeatLoader from "react-spinners/BeatLoader";

const LIMIT = 5;

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const [count, setCount] = useState(0);
  const [rdbCount, setRdbCount] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  console.log(rdbCount, count, "RDB and COUNT");
  const fetchItems = async ({ pageParam = 0 }) => {
    try {
      console.log("Fetching page:", pageParam);
      const response = await AxiosInstance.get(
        `/user/feed?limit=${LIMIT}&page=${pageParam}`
      );
      console.log(response.data.data);
      setCount(response.data.count);
      return {
        data: response.data.data,
        currentPage: pageParam,
        nextPage:
          pageParam + LIMIT < response.data.count ? pageParam + LIMIT : null,
      };
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }
  };

  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["items"],
      queryFn: fetchItems,
      initialPageParam: 1,
      retry: false,
      getNextPageParam: (lastPage) =>
        rdbCount > count
          ? lastPage.nextPage + (rdbCount - count)
          : lastPage.nextPage,
    });

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const addFeed = (newFeeds) => {
    setFeeds([...feeds, newFeeds]);
    closeModal();
  };
  const userType = () => {
    return localStorage.getItem("token");
  };

  pb.collection("FeedRecord").subscribe(
    "z51hsdr8v1wsh6h",
    function (e) {
      if (e.action == "update") {
        setRdbCount(e.record.count);
      }
    },
    {
      /* other options like expand, custom headers, etc. */
    }
  );

  return (
    <div className="w-[80%] m-auto">
      <div className="w-[80%] m-auto flex justify-end ">
        {userType() ? (
          <button
            className="px-4 bg-slate-500 py-2 rounded-md mt-4 text-slate-50"
            onClick={openModal}
          >
            Upload
          </button>
        ) : null}
      </div>
      <Modal open={isModalOpen} onClose={closeModal} center>
        <FeedUpload onClose={closeModal} onAddFeed={addFeed} />{" "}
        {/* Pass addGroup as prop */}
      </Modal>
      {status === "pending" ? (
        <div className="flex justify-center items-center h-screen">
          <GridLoader />
        </div>
      ) : status === "error" ? (
        <div>{error.message}</div>
      ) : (
        <div className="flex flex-col gap-2">
          {data.pages.map((page) => {
            return (
              <div key={page.currentPage} className="flex flex-col gap-2">
                {page.data.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="rounded-md bg-grayscale-700 p-4"
                    >
                      <CardPost
                        image={item.image}
                        title={item.title}
                        description={item.description}
                        _id={item._id}
                        user={item.user}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div ref={ref}>
            {isFetchingNextPage && (
              <div className="flex justify-center text-md">
                <BeatLoader />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
