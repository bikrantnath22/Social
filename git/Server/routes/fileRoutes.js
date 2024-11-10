const express = require("express");
const {
  imageUpload,
  videoUpload,
  documentUpload,
  imageUploadNsfw,
} = require("../controllers/fileController");
const Router = express.Router();

Router.post("/upload/image", imageUpload);
Router.post("/nsfw/image", imageUploadNsfw);
Router.post("/upload/video", videoUpload);
Router.post("/upload/document", documentUpload);

module.exports = Router;
