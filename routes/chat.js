const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chatController");

router.get("/small-chat/get-friends", chatController.getFriends);
router.get("smallchat/search-friends", chatController.searchFriends);
router.post("/small-chat/add-friend", chatController.addFriend);
router.post("/small-chat/startchatting", chatController.startChatting);
router.post("/small-chat/getChatList", chatController.getChatList);
router.get("/get-chat-contents", chatController.getChatContents);
