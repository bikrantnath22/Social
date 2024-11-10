import react, { useState, useEffect } from "react";
import AxiosInstance from "@/axios/axiosInstance";
import GridLoader from "react-spinners/GridLoader";
import { useParams } from "react-router-dom";
import { ThumbsUp } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
const PostById = () => {
  const { id } = useParams();
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const getaRes = async () => {
    const res = await AxiosInstance.get(`/user/post/${id}`, {
      //   withCredentials: true,
    });
    console.log(res.data);
    setState(res.data);
    setLoading(false);
  };

  const commentMutation = useMutation({
    mutationFn: async () => {
      const res = await AxiosInstance.post(`/user/comment/${id}`, {
        comment: comment,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Comment added successfully!");
      getaRes();
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });
  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await AxiosInstance.post(`/user/like/${id}`, {
        comment: comment,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Liked!");
      getaRes();
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });
  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const res = await AxiosInstance.post(`/user/unlike/${id}`, {
        comment: comment,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Unliked!");
      getaRes();
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  useEffect(() => {
    getaRes();
  }, []);
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <GridLoader />
      </div>
    );
  return (
    <div className="md:w-[85%] m-auto">
      <div className="">
        <div className="mx-auto  max-w-2xl my-2">
          <div className="bg-white shadow-2xl rounded-lg mb-6 tracking-wide">
            <div className="md:flex-shrink-0">
              <img
                src={state?.image}
                alt="mountains"
                className="w-full h-[400px] rounded-lg rounded-b-none object-fit"
              />
            </div>
            <div className="px-4 py-2 mt-2">
              <h2 className="font-bold text-2xl text-gray-800 tracking-normal">
                {state?.title}
              </h2>
              <p className="text-sm text-gray-700 px-2 mr-1 mb-4">
                {state?.description}
              </p>

              <div className="flex gap-2 items-center">
                {state?.likes?.includes(localStorage.getItem("userId")) ? (
                  <ThumbsUp
                    onClick={() => unlikeMutation.mutate()}
                    className="cursor-pointer fill-blue-500 text-blue-500"
                  />
                ) : (
                  <ThumbsUp
                    onClick={() => likeMutation.mutate()}
                    className="cursor-pointer "
                  />
                )}
                <span className="text-xs font-semibold">
                  {state?.likes?.length}
                </span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!comment) return;
                  commentMutation.mutate();
                }}
                className="mt-8 flex gap-2"
              >
                <textarea 
                rows={4}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comment"
                  className="p-2 border rounded-md outline-none w-[90%]"
                ></textarea>
                <Button>Send</Button>
              </form>

              <div className="mt-5 space-y-1">
                {state?.comments?.map((comment) => (
                  <div className="grid grid-cols-5 p-2 gap-2 rounded border">
                    <div className="flex w-[100px] flex-col items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                          }
                          alt="@shadcn"
                        />
                      </Avatar>
                      <h1 className="text-xs font-semibold text-zinc-400">
                        {comment?.user?.name}
                      </h1>
                    </div>
                    <div className="col-span-4">{comment?.comment}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostById;
