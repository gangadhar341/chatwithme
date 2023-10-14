const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware.js");
const {
  getNotifications,
  postNotification,
  deleteNotifications,
} = require("../Controller/notificationControllers.js");

router.route("/:chatId").delete(protect, deleteNotifications);
router
  .route("/")
  .get(protect, getNotifications)
  .post(protect, postNotification);

module.exports = router;
