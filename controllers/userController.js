import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../.config/generateToken.js";
import bcrypt from "bcryptjs";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(422).json({ error: "User already exists" });
  }
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    pic,
  });
  if (user) {
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
    });
  } else {
    return res.status(500).json({ error: "Failed to register user" });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const isPasswordCorrect = user && bcrypt.compareSync(password, user.password);
  if (isPasswordCorrect) {
    res.cookie("Authorization", generateToken(user._id), {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      httpOnly: true,
      sameSite: "lax",
    });
    const userInfo = {
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    };
    res.json(userInfo);
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find({ ...keyword, _id: { $ne: req.user._id } });

  res.send(users);
});

export { registerUser, authUser, allUsers };
