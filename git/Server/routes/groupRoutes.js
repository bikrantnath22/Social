const express = require("express");
const {
  addGroup,
  getGroups,
  sendMessage,
  getAllGroups,
  getGroupById,
  enrollGroup,
  acceptRequest,
  rejectRequest,
  removeUser,
  deleteGroup,
  leaveGroup,
  searchGroups,
} = require("../controllers/groupController");
const { isAuth } = require("../middleware/auth");
const Router = express.Router();

Router.get("/search", isAuth, searchGroups);
Router.post("/create", isAuth, addGroup);
Router.post("/send-message/:id", isAuth, sendMessage);
Router.get("/fetch", isAuth, getGroups);
Router.get("/groups", isAuth, getAllGroups);
Router.get("/:id", isAuth, getGroupById);
Router.post("/enroll/:id", isAuth, enrollGroup);
Router.post("/accept/:id", isAuth, acceptRequest);
Router.post("/reject/:id", isAuth, rejectRequest);
Router.post("/remove/:id", isAuth, removeUser);
Router.post("/leave/:id", isAuth, leaveGroup);
Router.delete("/delete/:id", isAuth, deleteGroup);

module.exports = Router;
