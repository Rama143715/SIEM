const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const env = require("../config/env");

function createAccessToken(user) {
  const jti = uuidv4();
  const token = jwt.sign(
    {
      email: user.email,
      role: user.role,
      jti,
    },
    env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN,
    },
  );

  return { token, jti };
}

function createRefreshToken(user) {
  const jti = uuidv4();
  const token = jwt.sign(
    {
      email: user.email,
      role: user.role,
      jti,
      type: "refresh",
    },
    env.JWT_REFRESH_SECRET,
    {
      subject: user.id,
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },
  );

  return { token, jti };
}

module.exports = {
  createAccessToken,
  createRefreshToken,
};