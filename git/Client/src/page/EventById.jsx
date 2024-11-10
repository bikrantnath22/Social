import React, { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import AxiosInstance from "../axios/axiosInstance";
import GridLoader from "react-spinners/GridLoader";
import { useMutation } from "@tanstack/react-query";
import { format, isBefore } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EventById() {
  const { id } = useParams();
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(true);

  const remindMutaion = useMutation({
    mutationFn: async () => {
      const res = await AxiosInstance.post(`/event/remind/${id}`);
      return res.data;
    },
    onSuccess: () => {
      getaRes();
    },
  });
  const getaRes = async () => {
    const res = await AxiosInstance.get(`/event/${id}`, {
      //   withCredentials: true,
    });
    console.log(res.data, localStorage.getItem("userId"));
    setState(res.data);
    setLoading(false);
  };

  useEffect(() => {
    getaRes();
  }, []);
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <GridLoader />
      </div>
    );

  const verifyAdmin = () => {
    const role = localStorage.getItem("role");
    return role === "admin" ? true : false;
  };
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      {/* Event Image */}
      <div className="w-full h-64 rounded-lg overflow-hidden">
        <img
          src={state?.image}
          alt="Event"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Event Title */}
      <h1 className="text-3xl font-bold text-gray-800">{state?.title}</h1>

      {/* Event Description */}
      <p className="text-gray-600 text-lg">{state?.description}</p>
      <div className="flex flex-col">
        <p className="font-semibold text-slate-500">
          Event starts at : {format(new Date(state?.start_date), "dd-MM-yyyy")}{" "}
          {format(state?.start_date, "H:mm a")}{" "}
        </p>
        <p className="font-semibold text-slate-500">
          Event ends at : {format(new Date(state?.end_date), "dd-MM-yyyy")}{" "}
          {format(state?.end_date, "H:mm a")}{" "}
        </p>
      </div>
      {/* Buttons */}
      <div className="flex justify-between space-x-4">
        {/* Register Button */}
        <div className="text-blue-500 text-xl">
          <UserOutlined /> {state?.remind_users?.length} enrolled
        </div>

        {isBefore(state?.start_date, new Date()) &&
        isBefore(new Date(), state?.end_date) ? (
          <>
            <p className="text-yellow-500 font-semibold">
              Event has already started
            </p>
          </>
        ) : isBefore(state?.end_date, new Date()) ? (
          <>
            <p className="text-red-500 font-semibold">
              Event has already ended
            </p>
          </>
        ) : state?.remind_users?.find(
            (user) => user._id == localStorage.getItem("userId")
          ) ? (
          <div className="px-6 py-2 border border-indigo-500 text-indigo-500 rounded-lg font-semibold  transition">
            RSVP has been set
          </div>
        ) : (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to send a reminder?"))
                remindMutaion.mutate();
            }}
            className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
          >
            RSVP
          </button>
        )}
      </div>
      {verifyAdmin() ? (
        <div>
          <Table>
            <TableCaption>A list of enrolled students.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Roll No</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state?.remind_users?.map((user) => (
                <TableRow key={user?._id}>
                  <TableCell>{user?.rollNo}</TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>{user?.name}</TableCell>
                  <TableCell>{user?.department}</TableCell>
                </TableRow>
              ))}
              <TableRow></TableRow>
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}
