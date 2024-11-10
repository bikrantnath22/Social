const Event = require("../models/event");
const schedule = require("node-schedule");
let pb;

(async () => {
  // Dynamically import PocketBase
  const module = await import("pocketbase");
  PocketBase = module.default;
  pb = new PocketBase("http://127.0.0.1:8090");
  await pb.admins.authWithPassword("admin@gmail.com", "1234567890");
})();

exports.uploadEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    const { start_date, end_date } = req.body;
    schedule.scheduleJob(new Date(start_date), async () => {
      try {
        console.log("working!");
        const data = await Event.findById(event._id);
        const remind_users = data.remind_users;
        remind_users.forEach((user) => {
          pb.collection(user).create({
            title: "Event is starting soon!",
            message: `Event "${event.title}" is starting soon!`,
            link: `/event/${event._id}`,
          });
        });
      } catch (error) {
        console.log(error);
      }
    });
    schedule.scheduleJob(new Date(end_date), async (id = event._id) => {
      try {
        const event = await Event.findById(id);
        const remind_users = event.remind_users;
        remind_users.forEach((user) => {
          pb.collection(user).create({
            title: "Event is starting soon!",
            message: `Event "${event.title}" is starting soon!`,
            link: `/event/${event._id}`,
          });
        });
      } catch (error) {
        console.log(error);
      }
    });
    await event.save();
    res.status(200).json({ message: "Event created successfully!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to upload event!" });
  }
};

exports.getEventFeed = async (req, res) => {
  try {
    const { page, limit } = req.query;
    // const skip = (page - 1) * limit;

    const posts = await Event.find()
      .sort({ createdAt: -1 })
      .skip(page - 1)
      .limit(limit);
    const documentsCount = await Event.countDocuments();
    return res.json({
      success: true,
      data: posts,
      count: documentsCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

exports.setRemindMe = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    const { userId } = req.user;
    if (event.remind_users.includes(userId)) {
      return res.status(400).json({ message: "User already set  reminder" });
    }
    await Event.findByIdAndUpdate(id, { $addToSet: { remind_users: userId } });
    return res.status(200).json({ message: "User set as a reminder" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to setReminder" });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('remind_users');
    if (!event) {
      return res.status(404).json({ message: "event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
