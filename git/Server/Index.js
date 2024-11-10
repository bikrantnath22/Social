const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const groupRoutes = require("./routes/groupRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { injectToken } = require("./middleware/auth");
const PORT = process.env.PORT || 8080;

const DB =// here database link
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/api/auth", authRoutes); // <- NEW LINE
app.use("/api/user", injectToken, userRoutes); // <- NEW LINE
app.use("/api/file", injectToken, fileRoutes); // <- NEW LINE
app.use("/api/group", injectToken, groupRoutes); // <- NEW LINE
app.use("/api/event", injectToken, eventRoutes); // <- NEW LINE
app.use(express.static("record"));
app.use(express.static("images"));
app.use(express.static("videos"));
app.use(express.static("documents"));
mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection established");
  })
  .catch((err) => {
    console.log("DB CONNECTION FAILED");
    console.log("ERR: ", err);
  });

// app.all('*', (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
// });

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
// let currentDate = new Date();
// currentDate.setMinutes(currentDate.getMinutes() + 1);
// schedule.scheduleJob(currentDate, () => {
//   console.log("Hello i ran!");
// });
