require("dotenv").config();
const { expressjwt: jwtMiddleware } = require("express-jwt");

const requiredAuth = jwtMiddleware({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

module.exports = {
  requiredAuth,
};