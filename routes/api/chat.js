const express = require("express");
const router = express.Router();
const Chat = require("../../src/models/Chat");
const ChatRoom = require("../../src/models/ChatRoom");
const serverError = require("../../util/serverError");
const middleware = require("../../middleware/middleware");

//new message
router.post("/", middleware, async (req, res) => {
  try {
    const { chatRoomId, senderId, chatText } = req.body;
    console.log(req.body);
    const newChat = await Chat.create({
      chatRoomId,
      senderId,
      chatText,
      chatDate: new Date(Date.now()),
    });
    await ChatRoom.update(
      {
        lastChat: chatText,
        lastUpdate: newChat.chatDate,
      },
      { where: { chatRoomId: chatRoomId } }
    );
    res.json(newChat);
  } catch (error) {
    console.log(error);
    serverError(res);
  }
});

//get chats in room
router.get("/:chatRoomId", middleware, async (req, res) => {
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
