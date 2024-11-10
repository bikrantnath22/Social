const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  file_url: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const Record = mongoose.model("record", recordSchema);

module.exports = Record;
