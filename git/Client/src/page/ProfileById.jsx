import { useEffect, useState } from "react";
import AxiosInstance from "@/axios/axiosInstance"; // Adjust path as needed
import CardPost from "@/components/CardPost";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GridLoader from "react-spinners/GridLoader";
import { useParams } from "react-router-dom";
function ProfileById() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const defaultProfile =
    "https://th.bing.com/th/id/OIP.HxV79tFMPfBAIo0BBF-sOgHaEy?rs=1&pid=ImgDetMain";
  const postPic =
    "https://th.bing.com/th/id/OIP.HxV79tFMPfBAIo0BBF-sOgHaEy?rs=1&pid=ImgDetMain";

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await AxiosInstance.get("/user/profile/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data.data.user);
        console.log(profileData);
        setPosts(response.data.data.posts);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    if (!id) return;
    fetchProfileData();
  }, [id]);

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
            <div className="bg-slate-100 rounded-lg p-2"></div>
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
                user={post.user}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileById;
