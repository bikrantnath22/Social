const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  rollNo: {
    type: String,
  },
  department: {
    type: String,
  },

  role: {
    type: String,
    default: "user",
  },

  isVerified: { type: Boolean, default: false },
  image: {
    type: String,
  },
  username: {
    type: String,
  },
  notification_id: {
    type: String,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
