const Group = require("../models/group");
let pb;
(async () => {
  // Dynamically import PocketBase
  const module = await import("pocketbase");
  PocketBase = module.default;
  pb = new PocketBase("http://127.0.0.1:8090");
  await pb.admins.authWithPassword("admin@gmail.com", "1234567890");
})();
exports.addGroup = async (req, res) => {
  const { userId } = req.user;

  try {
    const groupNameExist = await Group.findOne({ name: req.body.name });
    if (groupNameExist)
      return res.status(400).json({ message: "Group name already exists" });
    const newGroup = new Group({
      admin_users: [userId],
      ...req.body,
    });
    await newGroup.save();
    await pb.collections.create({
      name: newGroup._id.toString(),
      type: "base",
      viewRule: "",
      listRule: "",
      schema: [
        {
          name: "message",
          type: "text",
        },
        {
          name: "media_url",
          type: "text",
        },
        {
          name: "media_type",
          type: "text",
        },
        {
          name: "username",
          type: "text",
        },
      ],
    });
    return res.status(200).json({ message: "Group added successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to add group" });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const { userId } = req.user;
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
    return res.status(200).json({ success: true, data: groups });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to fetch groups" });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("admin_users")
      .populate("user")
      .populate("request");
    return res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to fetch groups" });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    return res.status(200).json({ success: true, data: groups });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to fetch groups" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { message, media_url, media_type, username } = req.body;
    const { id } = req.params;
    await pb.collection(id).create({
      message,
      media_url,
      media_type,
      username,
    });
    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed to send message" });
  }
};

exports.enrollGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const group = await Group.findById(id);
    console.log(group);
    if (group.user.includes(userId))
      return res.status(400).json({ message: "User already enrolled" });
    await Group.findByIdAndUpdate(id, { $addToSet: { request: userId } });
    return res.status(200).json({ message: "User enrolled successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed to send message" });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const group = await Group.findById(id);
    if (!group.user.includes(userId))
      return res.status(400).json({ message: "User not enrolled" });
    await Group.findByIdAndUpdate(id, { $pull: { user: userId } });
    return res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed to send message" });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const group = await Group.findById(id);
    if (group.user.includes(userId))
      return res.status(400).json({ message: "User already enrolled" });
    await Group.findByIdAndUpdate(id, { $addToSet: { user: userId } });
    await Group.findByIdAndUpdate(id, { $pull: { request: userId } });
    return res.status(200).json({ message: "User enrolled successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed to send message" });
  }
};
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const group = await Group.findById(id);
    console.log(group);
    if (group.user.includes(userId))
      return res.status(400).json({ message: "User already enrolled" });
    await Group.findByIdAndUpdate(id, { $pull: { request: userId } });
    return res.status(200).json({ message: "User enrolled successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed to send message" });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const group = await Group.findById(id);
    if (!group.user.includes(userId))
      return res.status(400).json({ message: "User not enrolled" });
    await Group.findByIdAndUpdate(id, { $pull: { user: userId } });
    return res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed to send message" });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    await Group.findByIdAndDelete(id);
    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed to send message" });
  }
};

exports.searchGroups = async (req, res) => {
  try {
    const { search } = req.query;
    console.log("aksjasj", search);
    const groups = await Group.find({
      name: {
        $regex: ".*" + search + ".*",
        $options: "i",
      },
    });
    return res.status(200).json({ success: true, data: groups });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to fetch groups" });
  }
};
