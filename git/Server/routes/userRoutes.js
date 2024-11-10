const express = require("express");
const Router = express.Router();
const {
  uploadRecord,
  fetchRecord,
  getUserDetails,
  uploadPost,
  getPostFeed,
  getPostById,
  getUserById,
  deletePost,
  addComment,
  addLike,
  unLike,
} = require("../controllers/userController");
const { isAuth } = require("../middleware/auth");

Router.post("/upload/record", uploadRecord);
Router.post("/post", isAuth, uploadPost);
Router.post("/comment/:id", isAuth, addComment);
Router.post("/like/:id", isAuth, addLike);
Router.post("/unlike/:id", isAuth, unLike);
Router.get("/record/:id", fetchRecord);
Router.get("/details", isAuth, getUserDetails);
Router.get("/profile/:id", isAuth, getUserById);
Router.get("/feed", getPostFeed);
Router.get("/post/:id", getPostById);
Router.delete("/post/:id", deletePost);

module.exports = Router;
