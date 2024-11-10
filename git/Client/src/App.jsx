import react, { useState, useEffect } from "react";
import { Outlet, BrowserRouter as Router, useParams } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Registration";
import Group from "./page/group";
// import AdminDashboard from "./page/admin /AdminDashboard";
// import UploadRecord from "./page/admin /UploadRecord";
import NotFound from "./page/NotFound";
import GroupChat from "./page/GroupChat";
import AdminDashboard from "./page/admin/AdminDashboard";
import UploadRecord from "./page/admin/UploadRecord";
import Event from "./page/Event";
import Profile from "./page/Profile";
import Notification from "./page/Notification";
import { Toaster } from "react-hot-toast";
import Post from "./page/PostById";
import AddEvent from "./page/admin/AddEvent";
import ManageGroup from "./page/ManageGroup";
import GroupInfo from "./page/GroupInfo";
import { useQuery } from "@tanstack/react-query";
import { useGetFetchQuery } from "./hooks";
import AxiosInstance from "./axios/axiosInstance";
import EventById from "./page/EventById";
import ProfileById from "./page/ProfileById";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const token = localStorage.getItem("token");
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await AxiosInstance.get("/user/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return {
          user: response.data.data.user,
          posts: response.data.data.posts,
          groups: response.data.data.groups,
        };
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    },
  });

  const verifyAdmin = () => {
    const role = localStorage.getItem("role");
    return role === "admin" ? true : false;
  };

  return (
    <>
      <Toaster />
      <ToastContainer />

      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<Post />} />

          <Route
            path="/profile"
            element={token ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:id"
            element={token ? <ProfileById /> : <Navigate to="/login" />}
          />
          <Route
            path="/event/:id"
            element={token ? <EventById /> : <Navigate to="/login" />}
          />
          <Route
            path="/notification"
            element={token ? <Notification /> : <Navigate to="/login" />}
          />
          <Route element={<GroupProtected />}>
            <Route
              path="/group-chat/:id"
              element={token ? <GroupChat /> : <Navigate to="/login" />}
            />
          </Route>
          <Route element={<GroupOpen />}>
            <Route
              path="/groupinfo/:id"
              element={token ? <GroupInfo /> : <Navigate to="/login" />}
            />
          </Route>

          <Route
            path="/manage-group/:id"
            element={token ? <ManageGroup /> : <Navigate to="/login" />}
          />

          <Route
            path="/event"
            element={token ? <Event /> : <Navigate to="/login" />}
          />

          <Route
            path="/group"
            element={token ? <Group /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/"
            element={verifyAdmin() && token ? <AdminDashboard /> : <Navigate to="/" />}
          >

          
            <Route path="/admin/dashboard" />
            <Route path="/admin/upload-record" element={<UploadRecord />} />
            <Route path="/admin/add-event" element={<AddEvent />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

const GroupProtected = () => {
  const my_id = localStorage.getItem("userId");
  const params = useParams();
  const data = useGetFetchQuery(["profile"]);
  const group = data?.groups?.find((group) => group._id === params.id);
  console.log(group);
  const accessToChat =
    group?.admin_users.includes(my_id) || group?.user.includes(my_id);

  return accessToChat ? (
    <Outlet />
  ) : (
    <Navigate replace to={"/groupinfo/" + params.id} />
  );
};
const GroupOpen = () => {
  const my_id = localStorage.getItem("userId");
  const params = useParams();
  const data = useGetFetchQuery(["profile"]);
  const group = data?.groups?.find((group) => group._id === params.id);
  console.log(group);
  const accessToChat =
    group?.admin_users.includes(my_id) || group?.user.includes(my_id);

  return accessToChat ? (
    <Navigate replace to={"/group-chat/" + params.id} />
  ) : (
    <Outlet />
  );
};

export default App;
