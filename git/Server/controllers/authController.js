const axios = require("axios");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const Dataset = require("../models/dataset");
let pb;

(async () => {
  // Dynamically import PocketBase
  const module = await import("pocketbase");
  PocketBase = module.default;
  pb = new PocketBase("http://127.0.0.1:8090");
  await pb.admins.authWithPassword("admin@gmail.com", "1234567890");
})();
const generateVerificationToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const sendVerificationEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const url = `http://localhost:8080/api/auth/api/verify/${token}`;
  transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your email",
    html: `<h3>Click the link below to verify your email:</h3><a href="${url}">${url}</a>`,
  });
};

exports.Auth = async (req, res) => {
  try {
    const { name, email, password, rollNo, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const emailExistDataset = await Dataset.findOne({ email });
    console.log(email, emailExistDataset);
    if (!emailExistDataset) {
      return res
        .status(400)
        .json({ message: "Email does not exist in university records!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      rollNo,
      department,
      username: name.split(" ").join("-") + "_",
    });
    await pb.collections.create({
      name: user._id.toString(),
      type: "base",
      viewRule: "",
      listRule: "",
      schema: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "message",
          type: "text",
        },
        {
          name: "link",
          type: "text",
        },
      ],
    });
    await user.save();

    const token = generateVerificationToken(user._id);
    sendVerificationEmail(email, token);
    res.status(200).json({
      message:
        "Registration successful. Check your email to verify your account.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error creating user", error });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, account_type: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id, // Add user ID
      name: user.name, // Assuming 'username' is the user's name
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.Token = async (req, res) => {
  try {
    const { token } = req.params;
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    await User.findByIdAndUpdate(userId, { isVerified: true });

    // res.status(200).json({ message: "Email verified successfully" });
    res.redirect("http://localhost:5173/login?verified=true");
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
