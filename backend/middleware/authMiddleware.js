const jwt = require("jsonwebtoken");
const User = require("../model/userschema.js");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = await req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded).select("-password");

      next();
    } catch (err) {
      res.status(401);
      res.json({
        error: err,
        message: "your not authorized",
      });
    }
  } else {
    res.status(401);
    res.json({
      message: "no token, your not authorized",
    });
  }
};

module.exports = { protect };
