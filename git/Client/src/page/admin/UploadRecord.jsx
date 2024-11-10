import { FileUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import AxiosInstance from "@/axios/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { REAQCT_QUERY_CONSTANTS } from "@/CONSTANTS";
export default function uploadRecord() {
  const ref = useRef();
  const [state, setState] = useState(null);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const userid = localStorage.getItem("userId");
    setUserId(userid);
  }, []);
  const query = useQuery({
    queryKey: [REAQCT_QUERY_CONSTANTS.ADMIN_RECORD],
    queryFn: async () => {
      const userid = localStorage.getItem("userId");
      const data = await AxiosInstance.get(`/user/record/${userid}`);
      return data;
    },
    refetchOnMount: "always",
  });
  const mutation = useMutation({
    mutationFn: handleUpload,
  });
  async function handleUpload() {
    try {
      const formData = new FormData();
      formData.append("file", state);
      formData.append("userid", userId);
      const res = await AxiosInstance.post("/user/upload/record", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      {query.isLoading ? (
        <div>Loading data.........</div>
      ) : query.data ? (
        <div className="border-teal-500 text-teal-500 shadow p-2 ml-2 border rounded-md">
          You have already uploaded the dataset!
        </div>
      ) : (
        <div className="flex justify-center items-center gap-5   ">
          <input
            ref={ref}
            onChange={(e) => setState(e.target.files[0])}
            type="file"
            className="hidden"
          />
          <div
            onClick={() => {
              ref.current.click();
            }}
            className="flex w-full gap-5 p-4 mt-2 ml-2 cursor-pointer text-emerald-500 border-emerald-400 border rounded-md "
          >
            <FileUp /> <h1>Upload dataset of the students in university </h1>
            {state && (
              <p className="text-indigo-500 font-semibold">{state.name}</p>
            )}
          </div>
          <Button onClick={() => handleUpload()} variant="outline">
            Upload
          </Button>
        </div>
      )}
    </>
  );
}
