const User = require("./../model/userschema.js");
const generateToken = require("../model/generateJWT.js");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  /*  if (!username || !email || !password) {
    res.status(400);
    throw new Error("please enter all feilds");
  } */
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "user already exists" });
  }
  const user = await User.create({
    username,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: await generateToken(user._id),
    });
    await user.save();
  } else {
    res.status(500).json({ message: "faild to create a user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  /* if (!email || !password) {
    res.status(400);
    throw new Error("please enter all feilds");
  } */

  const user = await User.findOne({ email });
  /*  console.log(user); */
  /* const isPassword = await user.matchPassword(password);
  console.log(isPassword); */
  if (user && (await user.matchPassword(password, await user.password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: await generateToken(user._id),
    });
  } else {
    res.status(401);
    res.json({
      message: "password not match",
      password: `entered password ${password}`,
    });
    /* throw new Error("Invalid username or password"); */
  }
};

const allusers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          /*  { email: { $regex: req.query.search, $options: "i" } }, */
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.send(users);
};

const updatePic = async (req, res) => {
  try {
    const { userId, newImage } = req.body;
    //console.log(newImage);
    //console.log(userId);
    //console.log(req.body);
    if (!userId || !newImage) return "invalid";
    const picUpdate = await User.findByIdAndUpdate(
      userId,
      { pic: newImage },
      { new: true }
    );

    await picUpdate.save();
    // console.log("picUpdate", picUpdate);
    if (!picUpdate) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.status(201).json({ picUpdate });
    }
  } catch (err) {
    //console.log(err);
    return res.sendStatus(500).json({
      error: err.message,
    });
  }
};

const getUser = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.json({ message: "please provide userId" });
  try {
    const user = await User.find({ _id: userId });

    if (user) res.status(200).json({ user });
    else {
      res.json({ error: "user not found" }).status(404);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { register, login, allusers, updatePic, getUser };
