const express = require("express");
const router = express.Router();
const ChatRoom = require("../../src/models/ChatRoom");
const serverError = require("../../util/serverError");
const middleware = require("../../middleware/middleware");
const sequelize = require("../../src/database/connection");
const { Op } = require("sequelize");

//new chatRoom
router.post("/", async (req, res) => {
  try {
    const { userOne, userTwo, chatRoomId } = req.body;
    const newChatRoom = await ChatRoom.create({
      userOne,
      userTwo,
    });
    res.json(newChatRoom);
  } catch (error) {
    console.log(error);
    serverError(res);
  }
});

router.post("/commonRoom", middleware, async (req, res) => {
  try {
    const { user1, user2 } = req.body;
    const commonRoom = await ChatRoom.findOne({
      where: {
        [Op.or]: [
          { userOne: user1, userTwo: user2 },
          { userOne: user2, userTwo: user1 },
        ],
      },
    });
    res.json(commonRoom);
  } catch (error) {
    console.log(error);
    serverError(res);
  }
});

router.get("/", middleware, async (req, res) => {
  try {
    const sql = `SELECT cr.chatRoomId, cr.lastChat, cr.lastUpdate, u.userId AS userOneId, u.name AS userOneName, ut.userId AS userTwoId,
    ut.name AS userTwoName FROM chatRoom cr join User u on u.userId = cr.userOne 
    join User ut on ut.userId = cr.userTwo 
    where userOne = ${req.user.id} OR userTwo = ${req.user.id}`;
    const chatRooms = await sequelize.query(sql);
    res.json(chatRooms[0]);
    console.log(chatRooms[0]);
  } catch (error) {
    console.log(error);
    serverError(res);
  }
});

//get chatrooms of a user
router.get("/:chatRoomId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // const chatRooms = await ChatRoom.findAll({
    //   where: { [Op.or]: [{ userOne: userId }, { userTwo: userId }] },
    // });
    const chatRooms = await ChatRoom.findByPk(req.params.chatRoomId);
    res.json(chatRooms);
  } catch (error) {
    serverError(res);
  }
});

module.exports = router;
