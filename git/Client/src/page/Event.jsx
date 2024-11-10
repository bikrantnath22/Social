import AxiosInstance from "@/axios/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { BeatLoader, GridLoader } from "react-spinners";
const LIMIT = 5;
export default function Event() {
  const fetchItems = async ({ pageParam = 0 }) => {
    try {
      console.log("Fetching page:", pageParam);
      const response = await AxiosInstance.get(
        `/event/feed?limit=${LIMIT}&page=${pageParam}`
      );
      console.log(response.data.data);
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
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <div>
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
                      <div className="w-[80%] m-auto">
                        <div className="">
                          <div className="mx-auto  max-w-xl my-2">
                            <div className="bg-white shadow-2xl rounded-lg mb-6 tracking-wide">
                              <Link to={`/event/${item._id}`}>
                                <div className="md:flex-shrink-0">
                                  <img
                                    src={
                                      item?.image ||
                                      "https://ik.imagekit.io/q5edmtudmz/post1_fOFO9VDzENE.jpg"
                                    }
                                    alt="mountains"
                                    className="w-full h-64 rounded-lg rounded-b-none object-cover"
                                  />
                                </div>
                              </Link>

                              <div className="px-4 py-2 mt-2">
                                <h2 className="font-bold text-2xl text-gray-800 tracking-normal">
                                  {item?.title}
                                </h2>
                                <p className="text-sm text-gray-700 px-2 mr-1">
                                  {item?.description.length > 300
                                    ? `${item?.description.slice(0, 300)}...`
                                    : item?.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
