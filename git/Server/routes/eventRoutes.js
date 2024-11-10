const express = require("express");
const { isAuth, isAdmin } = require("../middleware/auth");
const {
  uploadEvent,
  getEventFeed,
  getEventById,
  setRemindMe,
} = require("../controllers/eventController");
const Router = express.Router();

Router.post("/create", isAuth, isAdmin, uploadEvent);
Router.get("/feed", isAuth, getEventFeed);
Router.get("/:id", isAuth, getEventById);
Router.post("/remind/:id", isAuth, setRemindMe);

module.exports = Router;
