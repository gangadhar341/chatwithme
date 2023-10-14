const Chat = require("../model/chatschema.js");
const User = require("../model/userschema.js");

//const mongoose = require("mongoose");
const accessChat = async (req, res) => {
  //@description     Create or fetch One to One Chat
  //@route           POST /api/chat/
  //@access          Protected

  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  try {
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password ")
      .populate("latestMessage")
      .populate("profile", "pic");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "username email pic",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      const name = await User.find({ _id: userId });
      //console.log(req.user._id);

      var chatData = {
        chatName: name[0].username,
        isGroupChat: false,
        users: [req.user._id, userId],
        groupAdmin: req.user._id,
        profile: name[0]._id,
      };
      try {
        const createdChat = await Chat.create(chatData);
        // console.log("createdChat", createdChat);
        const FullChat = await Chat.findOne({ _id: createdChat._id })
          .populate("users", "-password")
          .populate({
            path: "latestMessage",
            select: "content",
          });
        await createdChat.save();
        // console.log(FullChat);
        res.status(200).json(FullChat);
      } catch (error) {
        console.log(error);
        res.status(400).json({
          message: error,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }

  //const objectId = new mongoose.Types.ObjectId(userId);
};

const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "_id username email pic",
        });
        res.status(200).send(results);
        //console.log(results);
      });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage", "content");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).json({ error });
  } else {
    res.json(updatedChat);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404).json({ message: "chat not found.." });
  } else {
    res.json(removed);
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404).json({ message: "chat not found" });
  } else {
    res.json(added);
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
