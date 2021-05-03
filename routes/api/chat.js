const express = require("express");
const router = express.Router();
const Chat = require("../../src/models/Chat");
const serverError = require("../../util/serverError");

//new message
router.post("/", async (req, res) => {
  try {
    const { chatRoomId, senderId, chatText } = req.body;
    console.log(req.body);
    const newChat = await Chat.create({
      chatRoomId,
      senderId,
      chatText,
    });
    res.json(newChat);
  } catch (error) {
    console.log(error);
    serverError(res);
  }
});

//get chats in room
router.get("/:chatRoomId", async (req, res) => {
  try {
    const chats = await Chat.findAll({
      where: { chatRoomId: req.params.chatRoomId },
    });
    res.json(chats);
  } catch (error) {
    console.log(error);
    serverError(res);
  }
});

module.exports = router;
