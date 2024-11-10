import React, { useRef, useState, useEffect, useCallback } from "react";

import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {
  
  LoginOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  BookOutlined,
  ProductOutlined ,
  BellFilled,
  MessageFilled,
} from "@ant-design/icons";

import NavBtns from "./NavBtn";
import { Link } from "react-router-dom";
import { useStore } from "@/store/store";
import PocketBase from "pocketbase";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
const pb = new PocketBase("http://127.0.0.1:8090");
export default function Header() {
  const hamburgerRef = useRef(null);
  const mobileViewRef = useRef(null);
  //   const cart = useSelector((state) => state.cart);
  const [mobileWidth, setMobileWidth] = useState(0);
  
  const notification_count = useStore((state) => state.notification_count);
  const notificaions = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      pb.collection(localStorage.getItem("userId")).getFullList({
        sort: "-created",
      }),
    refetchOnMount: "always",
  });
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "http://localhost:5173/";
  };

  const loggedIn = localStorage.getItem("firstLogin");

  
  pb.collection(localStorage.getItem("userId")).subscribe(
    "*",
    function (e) {
      notificaions.refetch();
    },
    {
      /* other options like expand, custom headers, etc. */
    }
  );

  useEffect(() => {
    if (notificaions?.data?.length > notification_count) {
      notificaions?.data
        ?.slice(0, notificaions?.data?.length - notification_count)
        .forEach((notificaion) => {
          toast(notificaion.title);
        });
    }
  }, [notificaions.data]);

  const userType = () => {
    return localStorage.getItem("token");
  };

  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  React.useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  useEffect(() => {
    if (dimensions.width >= 768) {
      mobileViewRef.current.classList.remove("animate-mobile-nav-close");
      mobileViewRef.current.classList.remove("animate-mobile-nav-open");
      hamburgerRef.current.classList.remove("open");
      mobileViewRef.current.classList.add("hide");
    }
  }, [dimensions.width]);
  console.log(mobileWidth);
  const handleCloseNavigation = () => {
    hamburgerRef.current.classList.remove("open");
    mobileViewRef.current.classList.add("animate-mobile-nav-close");
    mobileViewRef.current.classList.remove("animate-mobile-nav-open");
  };

  const verifyAdmin = () => {
    const role = localStorage.getItem("role");
    return role === "admin" ? true : false;
  };

  const toggleHamburger = () => {
    if (hamburgerRef === null) return; // ref is not initialised
    if (hamburgerRef.current.classList.contains("open")) {
      hamburgerRef.current.classList.remove("open");
      mobileViewRef.current.classList.add("animate-mobile-nav-close");
      mobileViewRef.current.classList.remove("animate-mobile-nav-open");

      return;
    }
    hamburgerRef.current.classList.add("open");
    mobileViewRef.current.classList.remove("hide");
    mobileViewRef.current.classList.add("animate-mobile-nav-open");
    mobileViewRef.current.classList.remove("animate-mobile-nav-close");
  };

  
  return (
    <>
      {/* ************************************************************************************ */}
      {/* DESKTOP  */}
      <div className="h-16 w-full">
        <nav className="z-30 fixed h-16 bg-gray-50 shadow-md px-7 items-center md:flex justify-between hidden w-screen ">
          {/* {Left part} */}
          {/* Anything to display in left most part of Navbar for desktop view change the following  */}

          <div className=" p-2 rounded-sm text-orange-600 text-3xl font-mono font-bold">
            <Link to="/">Social</Link>
          </div>

          <div className="flex space-x-4 items-center">
            {/* Right part  */}
            {/* Anything to display in right most part of Navbar for desktop view change the following  */}

            <></>
            {userType() ? (
              <>
                
                {verifyAdmin() ? (
                  <div className=" p-2 font-semibold rounded-sm text-slate-600">
                  <Link to="/admin/">
                    <NavBtns icon={<ProductOutlined />} title={"Admin"} />
                  </Link>
                </div>

                ):null}
               
                <div className=" p-2 font-semibold rounded-sm text-slate-600">
                  <Link to="/event">
                    <NavBtns icon={<BookOutlined />} title={"Event"} />
                  </Link>
                </div>
                
                <div className=" p-2 font-semibold rounded-sm text-slate-600">
                  <Link to="/group">
                    <NavBtns icon={<UsergroupAddOutlined />} title={"Group"} />
                  </Link>
                </div>
                <div className=" p-2 font-semibold rounded-sm text-slate-600">
                  <Link to="/profile">
                    <NavBtns icon={<UserOutlined />} title={"Profile"} />
                  </Link>
                </div>

                <div className="relative p-2 font-semibold rounded-sm text-blue-700 text-xl">
                  <Link to="/notification">
                    <BellFilled />
                  </Link>
                  {notification_count < notificaions?.data?.length ? (
                    <span className="absolute text-center text-xs top-[2px] right-[-1px] h-5 w-5 bg-red-600 text-white rounded-full">
                      {notificaions?.data?.length - notification_count}
                    </span>
                  ) : (
                    <></>
                  )}
                </div>

                <div className=" p-2 font-semibold rounded-sm text-slate-600">
                  <div className="flex ">
                    <button className="flex-end" onClick={handleLogout}>
                      <NavBtns icon={<LogoutOutlined />} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className=" p-2 font-semibold rounded-sm text-slate-600">
                <Link to="/login">
                  <NavBtns icon={<LoginOutlined />} title={"Login"} />
                </Link>
              </div>
            )}

            <></>
          </div>
        </nav>
      </div>

      {/* ALL THE NAV RELATED TO DESKTOP VIEW WILL BE DISPLAYED  */}

      {/* ******************************************************************************** */}

      {/* MOBILE */}
      <div className="mb-1 overflow-x-hidden  md:mb-0">
        <nav className=" h-[60px] overflow-x-hidden  md:hidden bg-orange-600 w-full z-30  flex  fixed top-0   ">
          <div className="flex py-5 w-full items-center ml-2 space-x-2 ">
            <div ref={hamburgerRef} id="nav-icon1" onClick={toggleHamburger}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="flex justify-between w-full">
              <div className=" rounded-sm text-2xl text-white font-bold">
                <Link to="/">Social</Link>
              </div>
            </div>
          </div>
        </nav>

        <div
          ref={mobileViewRef}
          className=" z-10 md:hidden top-[60px] min-h-[100vh] flex w-full   absolute hide"
        >
          {/* {main content to be displayed} */}
          {/* ANYTHING THAT NEEDS TO BE SHOWN IN MOBILE VIEW ADD BELOW  */}

          <>
            <div className=" space-y-4  w-[80%] p-2 bg-gray-200  min-h-[100vh] overflow-x-hidden  ">
              {userType() ? (
                <>
                {verifyAdmin() ? (
                  <div className=" p-2 font-semibold rounded-sm text-slate-600">
                  <Link to="/admin/">
                    <NavBtns icon={<ProductOutlined />} title={"Admin"} />
                  </Link>
                </div>

                ):null}
                  <div className="bg-gray-100 h-[50px] p-2 font-semibold rounded-sm text-slate-600">
                    <Link to="/profile">Profile</Link>
                  </div>
                  <div className="bg-gray-100 h-[50px] p-2 font-semibold rounded-sm text-slate-600">
                    <Link to="/event">Event</Link>
                  </div>
                  <div className="bg-gray-100 h-[50px] p-2 font-semibold rounded-sm text-slate-600">
                    <Link to="/group">Group</Link>
                  </div>
                  <div className="bg-gray-100 h-[50px] p-2 font-semibold rounded-sm text-slate-600">
                    <Link to="/notification">Notification</Link>
                    <span className="p-4 text-blue-700">
                    {notification_count < notificaions?.data?.length ? (
                      <span className="absolute text-center text-xs top-[2px] right-[-1px] h-5 w-5 bg-red-600 text-white rounded-full">
                        {notificaions?.data?.length - notification_count}
                      </span>
                    ) : (
                      <></>
                    )}
                    </span>
                  </div>
                  <div className="bg-gray-100 h-[50px] p-2 font-semibold rounded-sm text-slate-600 ">
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </>
              ) : (
                <div className="bg-gray-100 h-[50px] p-2 font-semibold rounded-sm text-slate-600">
                  <Link to="/login">Login</Link>
                </div>
              )}
            </div>

            <div
              className="w-[20%] bg-slate-400 opacity-50"
              onClick={handleCloseNavigation}
            ></div>
          </>
        </div>
      </div>

      {/* ******************************************************************************** */}
    </>
  );
}
