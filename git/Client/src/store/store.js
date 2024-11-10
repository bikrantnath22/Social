import { create } from "zustand";

const useStore = create((set) => ({
  notification_count: localStorage.getItem("notification_count")
    ? localStorage.getItem("notification_count")
    : 0,
  updateNotificationCount: (count) => {
    localStorage.setItem("notification_count", count);
    set({ notification_count: count });
  },
}));

export { useStore };
