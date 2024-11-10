const { IncomingForm } = require("formidable");
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
exports.imageUpload = async (req, res) => {
  const options = {
    uploadDir: path.join(__dirname, "..", "images"),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  };
  const form = new IncomingForm(options);

  try {
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
      const file = files?.file?.[0];
      if (_.isEmpty(file)) {
        console.log("Image is empty");
        return res.status(400).json({ message: "Missing image file" });
      }
      return res.status(200).json({
        success: true,
        data: `http://localhost:8080/${file.newFilename}`,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to upload image", error });
  }
};
exports.videoUpload = async (req, res) => {
  const options = {
    uploadDir: path.join(__dirname, "..", "videos"),
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024,
  };
  const form = new IncomingForm(options);

  try {
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
      const file = files?.file?.[0];
      if (_.isEmpty(file)) {
        console.log("Image is empty");
        return res.status(400).json({ message: "Missing image file" });
      }
      return res.status(200).json({
        success: true,
        data: `http://localhost:8080/${file.newFilename}`,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to upload image", error });
  }
};
exports.documentUpload = async (req, res) => {
  const options = {
    uploadDir: path.join(__dirname, "..", "documents"),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  };
  const form = new IncomingForm(options);

  try {
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
      const file = files?.file?.[0];
      if (_.isEmpty(file)) {
        console.log("Image is empty");
        return res.status(400).json({ message: "Missing image file" });
      }
      return res.status(200).json({
        success: true,
        data: `http://localhost:8080/${file.newFilename}`,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to upload image", error });
  }
};

exports.imageUploadNsfw = async (req, res) => {
  const options = {
    uploadDir: path.join(__dirname, "..", "images"),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  };
  const form = new IncomingForm(options);

  try {
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
      const file = files?.file?.[0];
      if (_.isEmpty(file)) {
        console.log("Image is empty");
        return res.status(400).json({ message: "Missing image file" });
      }
      data = new FormData();
      data.append(
        "media",
        fs.createReadStream(
          `${path.join(__dirname, "..", "images", file.newFilename)}`
        )
      );
      data.append("models", "nudity-2.1,recreational_drug,gore-2.0,violence");
      data.append("api_user", "1302280362");
      data.append("api_secret", "W9XGLJUF9w4DWUD8rqXkzYZFP9F956FL");
      const ai_res = await axios({
        method: "post",
        url: "https://api.sightengine.com/1.0/check.json",
        data: data,
        headers: data.getHeaders(),
      });
      const image_probability = {
        nudity: 1 - ai_res.data.nudity.none,
        drugs: ai_res.data.recreational_drug.prob,
        gore: ai_res.data.gore.prob,
        violence: ai_res.data.violence.prob,
      };
      let isImageSafe = true;
      for (const [key, value] of Object.entries(image_probability)) {
        if (value > 0.5) {
          isImageSafe = false;
          break;
        }
      }

      if (!isImageSafe) {
        return res.status(400).json({ message: "Image is not safe for work" });
      }

      return res.status(200).json({
        success: true,
        data: `http://localhost:8080/${file.newFilename}`,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to upload image", error });
  }
};

// function fileToGenerativePart(path, mimeType) {
//   return {
//     inlineData: {
//       data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//       mimeType,
//     },
//   };
// }
