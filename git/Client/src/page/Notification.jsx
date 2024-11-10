import React, { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useStore } from "@/store/store";
import { useGetFetchQuery } from "@/hooks";
import { Link } from "react-router-dom";

const Notifications = () => {
  const data = useGetFetchQuery(["notifications"]);
  const updateNotificationCount = useStore(
    (state) => state.updateNotificationCount
  );
  useEffect(() => {
    updateNotificationCount(data?.length);
  }, [data]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((notification) => (
          <Link to={notification.link || "#"}>
            <div
              key={notification.id}
              className={`p-4 rounded-lg border cursor-pointer ${
                notification.isRead
                  ? "bg-gray-100 border-gray-200"
                  : "bg-indigo-100 border-indigo-300"
              } transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">
                  {notification.title}
                </h3>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(notification.created, {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-gray-600 mt-1">{notification.message}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
