import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("No user id");
    res.status(422);
    return;
  }
  var isChat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic",
  });
  if (isChat && isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findById(createdChat._id).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    res.status(422).send("Invalid group chat data");
    return;
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    res.status(422).send("More than 2 users are required");
    return;
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });

    const fullChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(fullChat);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  if (!req.body.chatId || !req.body.name) {
    res.status(422).send("Invalid group chat data");
    return;
  }
  try {
    const groupChat = await Chat.findByIdAndUpdate(req.body.chatId, {
      chatName: req.body.name,
    });
    const fullChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(fullChat);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  if (!req.body.chatId || !req.body.userId) {
    res.status(422).send("Invalid group chat data");
    return;
  }
  try {
    const groupChat = await Chat.findByIdAndUpdate(req.body.chatId, {
      $push: { users: req.body.userId },
    });
    const fullChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(fullChat);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  if (!req.body.chatId || !req.body.userId) {
    res.status(422).send("Invalid group chat data");
    return;
  }
  try {
    const groupChat = await Chat.findByIdAndUpdate(req.body.chatId, {
      $pull: { users: req.body.userId },
    });
    const fullChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(fullChat);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

export {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
