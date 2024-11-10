import { useEffect, useState } from "react";
import AxiosInstance from "@/axios/axiosInstance"; // Adjust path as needed
import CardPost from "@/components/CardPost";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GridLoader from "react-spinners/GridLoader";
import { Link } from "react-router-dom";
function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const defaultProfile =
    "https://th.bing.com/th/id/OIP.HxV79tFMPfBAIo0BBF-sOgHaEy?rs=1&pid=ImgDetMain";
  const postPic =
    "https://th.bing.com/th/id/OIP.HxV79tFMPfBAIo0BBF-sOgHaEy?rs=1&pid=ImgDetMain";

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await AxiosInstance.get("/user/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data.data.user);
        console.log(profileData);
        setPosts(response.data.data.posts);
        setGroups(response.data.data.groups);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <GridLoader />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-y-auto flex flex-col sm:flex-row">
        {/* Left section */}
        <div className="bg-slate-50 w-full lg:w-1/3 p-4 text-white rounded-b-lg lg:rounded-r-lg">
          <div className="flex flex-col items-center mb-4">
            <img
              src={defaultProfile}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4 border-4 border-slate-400"
            />
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700 mr-2">
                {profileData?.name}
              </h2>
              <i className="ri-pencil-line text-gray-700 cursor-pointer"></i>
            </div>
            <p className="text-gray-700">Email: {profileData?.email}</p>
            <p className="text-gray-700">Roll Number: {profileData?.rollNo}</p>
          </div>

          {/* Accordions */}
          <div className="space-y-4 overflow-auto h-72">
            <div className="bg-slate-100 rounded-lg p-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Groups Joined
              </h3>
              {groups.map((group, index) => (
                <div key={index} className="p-4 max-w-sm">
                  <div className="flex rounded-lg h-full dark:bg-gray-800 bg-gray-200 p-8 flex-col">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={group.image || "https://github.com/shadcn.png"}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <Link to={`/group-chat/${group._id}`}>
                        <h1 className="font-semibold text-gray-800">
                          {group.name}
                        </h1>
                      </Link>
                    </div>

                    <div className="flex flex-col justify-between flex-grow">
                      <p className="leading-relaxed text-base text-gray-800">
                        {group.description}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Members: {group.user.length + group.admin_users.length}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="bg-gray-100 w-full lg:w-2/3 p-6  overflow-auto h-[100vh]">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            <span className="text-orange-600 capitalize font-semibold">
              {profileData.name}'s
            </span>{" "}
            posts
          </h1>
          <div className="space-y-4">
            {posts.map((post, index) => (
              <CardPost
                description={post.description}
                title={post.title}
                image={post.image}
                key={index}
                isDeleteable={true}
                _id={post._id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
