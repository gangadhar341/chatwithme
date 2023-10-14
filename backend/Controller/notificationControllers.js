const Notifications = require("../model/notification.js");
const Chat = require("../model/chatschema.js");
const mongoose = require("mongoose");

const postNotification = async (req, res) => {
  const { chatId, newMessage, sender } = req.body;
  // console.log("user", req.user);

  if (!chatId || !newMessage) return;

  var isNotification = await Notifications.find({
    sender: sender,
    chat: chatId,
  })
    .populate("chat", "-profile")
    .populate("sender", "-pic");

  //console.log("created", isNotification);

  if (isNotification.length > 0) {
    isNotification[0].content.push(newMessage);
    await isNotification[0].save();
    // console.log("noti controll", isNotification);
    res.status(200).json({ fullNotification: isNotification });
  } else {
    try {
      //console.log("sender", req.user._id);
      const newNotification = await Notifications.create({
        sender: sender,
        content: [newMessage],
        chat: chatId,
      });
      // console.log("user", req.user);
      const fullNotification = await Notifications.findOne({
        _id: newNotification._id,
      })
        .populate("chat", "-profile")
        .populate("sender", "-pic");
      // console.log("full", fullNotification);
      await fullNotification.save();
      res.status(201).json({
        fullNotification: [fullNotification],
      });
    } catch (e) {
      res.status(400).json({
        error: e,
      });
    }
  }
};

const getNotifications = async (req, res) => {
  try {
    const allNotifications = await Notifications.find({})
      .populate("chat", "-profile ")
      .populate("sender", "-pic -password");
    /* fullNotification */

    //console.log("all", allNotifications);
    if (!allNotifications.length > 0)
      return res.json({ fullNotification: allNotifications });
    var userNotification = allNotifications.filter((ele) => {
      if (!ele.sender) return;
      // console.log("req.user", req.user, ele.sender);
      return ele.chat.users.some((id) => {
        return (
          new mongoose.Types.ObjectId(id).equals(req.user._id) &&
          !new mongoose.Types.ObjectId(ele.sender._id).equals(req.user._id)
        );
      });
    });
    // console.log("userNotification", userNotification);
    res.status(200).json({ fullNotification: userNotification });
  } catch (e) {
    console.log(e);
    res.status(404).json({
      e,
    });
  }
};

const deleteNotifications = async (req, res) => {
  const { chatId } = req.params;
  if (!chatId) return;
  var chat = await Chat.find({ _id: chatId }).populate("users", "-pic");
  //console.log("req", req.user);
  if (!chat) return;

  try {
    const { data } = await Notifications.deleteOne({
      chat: chatId,
      sender: { $ne: req.user._id },
    });
    res.status(204).json({
      data,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ e });
  }
};

module.exports = { getNotifications, postNotification, deleteNotifications };
