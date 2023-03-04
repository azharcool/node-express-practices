const jwt = require("jsonwebtoken");
// require("dotenv").config();

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startWith("Bearer ")) {
    return res.sendStatus(401);
  }
  console.log(authHeader); //* Bearer token
  const token = authHeader?.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.send(401).json({
        message: "token invalid",
      });
    }

    req.user = decoded.userInfo.username;
    req.roles = decoded.userInfo.roles;
    next();
  });
};

module.exports = verifyJwt;
