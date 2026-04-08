const express = require("express");
const {
  getAllUserForSidebar,
  getMessages,
  sendMessage,
} = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/auth");
const upload = require("../middleware/mullter");
const router = express.Router();

// router.post("/sendMessage", sendMessage);
router.get("/getAllUserForSidebar", authMiddleware, getAllUserForSidebar);
router.get("/getMessages/:id", authMiddleware, getMessages);
// router.post("/sendMessage/:id",authMiddleware , sendMessage)

router.post(
  "/sendMessage/:id",
  authMiddleware,
  upload.fields([
    { name: "pic", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  sendMessage
);

module.exports = router;
