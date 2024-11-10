const User = require("../models/user");
const Group = require("../models/group");
const Dataset = require("../models/dataset");
const Post = require("../models/Post");
const path = require("path");
const { IncomingForm } = require("formidable");
const _ = require("lodash");
const Record = require("../models/record");
const csv = require("csv-parser");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Comment = require("../models/comment");
let pb;

(async () => {
  // Dynamically import PocketBase
  const module = await import("pocketbase");
  PocketBase = module.default;
  pb = new PocketBase("http://127.0.0.1:8090");
  await pb.admins.authWithPassword("admin@gmail.com", "1234567890");
})();
exports.uploadRecord = async (req, res) => {
  try {
    const options = {
      uploadDir: path.join(__dirname, "..", "record"),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
    };
    const form = new IncomingForm(options);
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        if (err.code === 1009)
          return res
            .status(400)
            .json({ success: false, message: "Maximum supported file is 5mb" });
        else
          return res
            .status(400)
            .json({ success: false, message: "Somethings went wrong!" });
      }
      console.log(fields);
      const file = files?.file?.[0];

      if (file == undefined || _.isEmpty(file)) {
        return res.status(400).json({ message: "Missing record file" });
      }
      console.log("New record arrived:", file.newFilename);
      const record = new Record({
        file_url: `http://localhost:8080/${file.newFilename}`,
        user: fields.userid[0],
      });

      let results = [];
      fs.createReadStream(
        path.join(__dirname, "..", "record", file.newFilename)
      )
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          console.log(results);
          const updatedDataSet = results.map((data) => ({
            name: data.name,
            email: data.email,
            rollno: data.rollno,
          }));

          await Dataset.insertMany(updatedDataSet);
          await record.save();
          return res
            .status(200)
            .json({ success: true, message: "Updated profile!" });
        });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to upload record" });
  }
};

exports.fetchRecord = async (req, res) => {
  try {
    const data = await Record.findOne({ user: req.params.id });
    if (data) {
      return res.status(200).json({ success: true, data: data });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to retrieve record" });
  }
};

exports.uploadPost = async (req, res) => {
  try {
    const post = new Post({
      user: req.user.userId,
      ...req.body,
    });
    await post.save();
    const dbCount = await Post.countDocuments();
    await pb.collection("FeedRecord").update("z51hsdr8v1wsh6h", {
      count: dbCount,
    });
    res.status(200).json({ success: true, message: "Uploaded post!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to upload post!" });
  }
};

// Fetch user details (name, email, rollNo)
exports.getUserDetails = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId).select("-password");
    const posts = await Post.find({ user: userId }).populate("user").sort({
      createdAt: -1,
    });
    const groups = await Group.find({
      $or: [
        {
          admin_users: userId,
        },
        {
          user: userId,
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, data: { user, posts, groups } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    const posts = await Post.find({ user: id }).populate("user");
    const groups = await Group.find({
      $or: [
        {
          admin_users: id,
        },
        {
          user: id,
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, data: { user, posts, groups } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};

exports.getPostFeed = async (req, res) => {
  try {
    const { page, limit } = req.query;
    // const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(page - 1)
      .limit(limit);
    const documentsCount = await Post.countDocuments();
    return res.json({
      success: true,
      data: posts,
      count: documentsCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch user post!" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const product = await Post.findById(req.params.id).populate({
      path: "comments",
      populate: {
        path: "user",
        model: "user",
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to delete post" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { comment } = req.body;
    const newComment = new Comment({
      comment: comment,
      user: userId,
    });
    await newComment.save();
    await Post.findByIdAndUpdate(id, {
      $addToSet: { comments: newComment._id },
    });
    return res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to add comment" });
  }
};

exports.addLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    await Post.findByIdAndUpdate(id, {
      $addToSet: { likes: userId },
    });
    return res.status(200).json({ message: "Like added successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to add like" });
  }
};
exports.unLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    await Post.findByIdAndUpdate(id, {
      $pull: { likes: userId },
    });
    return res.status(200).json({ message: "Unliked  successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to add like" });
  }
};
