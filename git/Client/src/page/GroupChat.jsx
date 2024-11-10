import AxiosInstance from "@/axios/axiosInstance";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import PocketBase from "pocketbase";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import MediaForm from "@/components/MediaForm";
import { format } from "date-fns";
import { File } from "lucide-react";
const pb = new PocketBase("http://127.0.0.1:8090");

function YouSent({ message, media_url, media_type, username, created }) {
  return (
    <div class="col-start-6 col-end-13 p-3 rounded-lg">
      <div class="flex items-center justify-start flex-row-reverse">
        <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          {username.charAt(0).toUpperCase()}
        </div>

        <div class="relative flex flex-col items-end mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
          {media_type == "image" ? (
            <>
              <div>
                <img
                  src={media_url}
                  alt="media"
                  className="w-[400px] h-[200px]"
                />
              </div>
            </>
          ) : media_type == "video" ? (
            <>
              <div>
                <video
                  src={media_url}
                  controls
                  className="w-[400px] h-[200px]"
                />
              </div>
            </>
          ) : media_type == "doc" ? (
            <>
              <div>
                <a href={media_url} target="_blank" rel="noreferrer">
                  <File
                    className="w-[300px] h-[200px] text-red-500"
                    size={40}
                    strokeWidth={1.5}
                  />
                </a>
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="font-semibold text-sm">{message}</div>
          <div className="text-xs text-gray-400">
            {username?.split("_")[0]} at {format(created, "dd-MM h:mm a")}
          </div>
        </div>
      </div>
    </div>
  );
}
function OtherSent({ message, media_url, media_type, username, created }) {
  return (
    <div class="col-start-1 col-end-8 p-3 rounded-lg">
      <div class="flex flex-row items-center">
        <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          {username.charAt(0).toUpperCase()}
        </div>
        <div class="relative  ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
          <div class="relative  items-end mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
            {media_type == "image" ? (
              <>
                <div>
                  <img
                    src={media_url}
                    alt="media"
                    className="w-[400px] h-[200px]"
                  />
                </div>
              </>
            ) : media_type == "video" ? (
              <>
                <div>
                  <video
                    src={media_url}
                    controls
                    className="w-[400px] h-[200px]"
                  />
                </div>
              </>
            ) : media_type == "doc" ? (
              <>
                <div>
                  <a href={media_url} target="_blank" rel="noreferrer">
                    <File
                      className="w-[300px] h-[200px] text-red-500"
                      size={40}
                      strokeWidth={1.5}
                    />
                  </a>
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="font-semibold text-sm">{message}</div>
            <div className="text-xs text-gray-400">
              {username?.split("_")[0]} at {format(created, "dd-MM h:mm a")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupChat() {
  const params = useParams();
  const chatRef = useRef();
  const chatQuery = useQuery({
    queryKey: ["CHAT_HISTORY"],
    queryFn: async () => {
      const data = await pb.collection(params.id).getFullList({
        sort: "created",
      });
      return data;
    },
  });

  useEffect(() => {
    setTimeout(() => {
      chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
    }, 300);
  }, [chatQuery.data, chatRef]);

  pb.collection(params.id).subscribe(
    "*",
    function (e) {
      chatQuery.refetch();
    },
    {
      /* other options like expand, custom headers, etc. */
    }
  );
  async function handleSendMessage(e) {
    e.preventDefault();
    try {
      const message = e.target.message.value;
      if (!message) return;
      await AxiosInstance.post("/group/send-message/" + params.id, {
        message: message,
        username: localStorage.getItem("username"),
        media_type: "",
        media_url: "",
      });
      e.target.message.value = "";
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  }
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addFeed = (newFeeds) => {
    setFeeds([...feeds, newFeeds]);
    closeModal();
  };

  return (
    <div className="flex-col   flex ">
      <div class="flex  antialiased  text-gray-800">
        <div class="flex flex-row h-full w-full md:w-[80%] overflow-x-hidden m-auto">
          <div class="flex  flex-col flex-auto h-full p-2 ">
            <div class="flex  flex-col pb-12 h-[85vh] flex-auto relative flex-shrink-0 rounded-2xl bg-gray-100  ">
              <div
                ref={chatRef}
                class="flex  flex-col h-full overflow-auto mb-4"
              >
                <div class="flex flex-col h-full">
                  <div class=" gap-y-2">
                    {chatQuery.data?.map((chat) => {
                      if (chat.username === localStorage.getItem("username")) {
                        return (
                          <YouSent
                            key={chat.id}
                            message={chat.message}
                            media_url={chat.media_url}
                            media_type={chat.media_type}
                            username={chat.username}
                            created={chat.created}
                          />
                        );
                      } else {
                        return (
                          <OtherSent
                            key={chat.id}
                            message={chat.message}
                            media_url={chat.media_url}
                            media_type={chat.media_type}
                            username={chat.username}
                            created={chat.created}
                          />
                        );
                      }
                    })}
                  </div>
                </div>
              </div>

              <Modal open={isModalOpen} onClose={closeModal} center>
                <MediaForm
                  onClose={closeModal}
                  onAddGroup={addFeed}
                  handleSendMessage={handleSendMessage}
                />
              </Modal>

              <div className="absolute bottom-0 w-full mr-20">
                <div class="flex flex-row items-center h-16 rounded-xl bg-white px-4 ">
                  <div>
                    <button
                      class="flex items-center justify-center text-gray-400 hover:text-gray-600"
                      onClick={openModal}
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <form
                    onSubmit={handleSendMessage}
                    class="flex flex-grow gap-2 ml-4"
                  >
                    <div class="relative w-full">
                      <input
                        type="text"
                        name="message"
                        class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                      />
                    </div>
                    <button
                      type="submit"
                      class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                    >
                      <span>Send</span>
                      <span class="ml-2">
                        <svg
                          class="w-4 h-4 transform rotate-45 -mt-px"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          ></path>
                        </svg>
                      </span>
                    </button>
                  </form>
                  <div class="ml-5 flex items-center gap-5 ">
                    <div className=" m-auto flex justify-end ">
                      <Link to={"/manage-group/" + params.id}>
                        <button className="px-4 bg-slate-500 py-2 rounded-md  text-slate-50">
                          Manage
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupChat;
