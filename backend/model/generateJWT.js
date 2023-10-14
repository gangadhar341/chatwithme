const jwt = require("jsonwebtoken");

const generateToken = async (id) => {
  /* console.log(id.toJSON()); */

  return await jwt.sign(id.toJSON(), process.env.JWT_SECRET);
  /*   expiresIn: '1h'
   */
};

module.exports = generateToken;
