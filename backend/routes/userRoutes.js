const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();
const {
  register,
  login,
  allusers,
  updatePic,
  getUser,
} = require("../Controller/userControllers.js");

router.post("/register", register);
router.route("/").post(login).get(allusers);
router.route("/getuser").get(protect, getUser);
router.route("/updatepic").put(protect, updatePic);

module.exports = router;
