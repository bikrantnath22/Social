import React from "react";

import { CloseSquareOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import AxiosInstance from "@/axios/axiosInstance";
import toast from "react-hot-toast";

export default function ManageGroup() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const groupQuery = useQuery({
    queryKey: ["group", id],
    queryFn: async () => {
      try {
        const response = await AxiosInstance.get("/group/" + id);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (userid) => {
      try {
        const response = await AxiosInstance.post("/group/accept/" + id, {
          userId: userid,
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      groupQuery.refetch();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (userid) => {
      try {
        const response = await AxiosInstance.post("/group/reject/" + id, {
          userId: userid,
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      groupQuery.refetch();
    },
  });
  const removeMutation = useMutation({
    mutationFn: async (userid) => {
      try {
        const response = await AxiosInstance.post("/group/remove/" + id, {
          userId: userid,
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      groupQuery.refetch();
    },
  });
  const leaveMutation = useMutation({
    mutationFn: async (userid) => {
      try {
        const response = await AxiosInstance.post("/group/leave/" + id, {
          userId: userid,
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      groupQuery.refetch();
      queryClient.invalidateQueries(["profile]"]);
    },
  });
  async function deleteGroup() {
    try {
      const response = await AxiosInstance.delete("/group/delete/" + id);
      if (response.status == 200) {
        toast.success("Group deleted successfully!");
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex flex-col w-[80%] justify-center m-auto p-4">
      <div>
        
      </div>
      <div className="flex  justify-between">
        <div className="flex flex-col w-full items-center m-10">
          <h1 className="font-bold text-slate-700">Group members</h1>
          {groupQuery?.data?.user?.length == 0 && (
            <p className="text-red-500 font-semibold">No members</p>
          )}
          <div className="flex  flex-col justify-center m-auto p-4 h-72 overflow-auto">
            {groupQuery?.data?.user?.map((user) => (
              <div className="bg-stone-50 w-[400px]  m-auto  p-4">
                <div class="flex items-center mb-4 border-b-gray-300 border-b pb-2 justify-between">
                  <div>
                    <label
                      for="country-option-1"
                      class="text-sm capitalize font-semibold text-gray-900 ml-2 block"
                    >
                      {user.name}
                    </label>
                  </div>
                  {groupQuery?.data?.admin_users?.find(
                    (user) => user._id == localStorage.getItem("userId")
                  ) && (
                    <div className="flex-end flex justify-center items-center">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to remove " + user.name
                            )
                          ) {
                            removeMutation.mutate(user._id);
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {groupQuery?.data?.admin_users?.find(
          (user) => user._id == localStorage.getItem("userId")
        ) && (
          <div className="flex w-full flex-col items-center m-10">
            <h1 className="font-bold text-slate-700">Requested</h1>
            {groupQuery?.data?.request?.length == 0 && (
              <p className="text-red-500 font-semibold">No request</p>
            )}
            <div className="flex flex-col  justify-center m-auto p-4 h-72 overflow-auto">
              {groupQuery?.data?.request?.map((user) => (
                <div className="bg-stone-50 w-[400px]  m-auto  p-4">
                  <div class="flex items-center mb-4 border-b-gray-300 border-b pb-2 justify-between">
                    <Link to={"/profile" + user._id}>
                      <div>
                        <label
                          for="country-option-1"
                          class="text-sm capitalize font-semibold text-gray-900 ml-2 block"
                        >
                          {user.name}
                        </label>
                      </div>
                    </Link>
                    <div className="flex-end flex justify-center items-center gap-2">
                      <Button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to accept this request?"
                            )
                          ) {
                            acceptMutation.mutate(user._id);
                          }
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to reject this request?"
                            )
                          ) {
                            rejectMutation.mutate(user._id);
                          }
                        }}
                        variant="destructive"
                      >
                        Deny
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {groupQuery?.data?.admin_users?.find(
        (user) => user._id == localStorage.getItem("userId")
      ) ? (
        <div className="flex justify-center">
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to delete this group? Non reversible"
                )
              ) {
                deleteGroup();
              }
            }}
            className="bg-red-500 rounded px-8 py-2 text-stone-50"
          >
            Delete Group
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to leave this group? Non reversible"
                )
              ) {
                leaveMutation.mutate(localStorage.getItem("userId"));
              }
            }}
            className="bg-red-500 rounded px-8 py-2 text-stone-50"
          >
            Leave Group
          </button>
        </div>
      )}
    </div>
  );
}
