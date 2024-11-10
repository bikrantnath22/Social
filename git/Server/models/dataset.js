const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  rollno: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
});

const Dataset = mongoose.model("dataset", datasetSchema);

module.exports = Dataset;
