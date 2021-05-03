const express = require("express");
const router = express.Router();
const ChatRoom = require("../../src/models/ChatRoom");
const serverError = require("../../util/serverError");
const { Op } = require("sequelize");

//new chatRoom
router.post("/", async (req, res) => {
  try {
    const { userOne, userTwo, chatRoomId } = req.body;
    const newChatRoom = await ChatRoom.create({
      chatRoomId,
      userOne,
      userTwo,
    });
    res.json(newChatRoom);
  } catch (error) {
    console.log(error);
    serverError(res);
  }
});

//get chatrooms of a user
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const chatRooms = await ChatRoom.findAll({
      where: { [Op.or]: [{ userOne: userId }, { userTwo: userId }] },
    });
    res.json(chatRooms);
  } catch (error) {
    serverError(res);
  }
});

module.exports = router;
