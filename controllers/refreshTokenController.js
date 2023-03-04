// const userData = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
const User = require("../model/User");

const jwt = require("jsonwebtoken");
// require("dotenv").config();

const handleRefreshToken = async (req, res) => {
  console.log("refresh-controller,", req.cookies)
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401);
  }
  const refreshToken = cookies.jwt;

  // const foundPerson = userData.users.find(
  //   (i) => i.refreshToken === refreshToken
  // );
  console.log("refresh-controller,", refreshToken)
  const foundPerson = await User.findOne({ refreshToken }).exec();
  console.log(foundPerson, refreshToken);

  if (!foundPerson) {
    return res.status(401).json({
      message: "Forbidden",
    });
  }

  //* Evaluate JWT
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    console.log("decoded", decoded);
    if (err || foundPerson.username !== decoded.userInfo.username) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          username: foundPerson.username,
          roles: Object.values(foundPerson.roles),
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30s",
      }
    );

    return res.json({
      accessToken,
    });
  });
};

module.exports = {
  handleRefreshToken,
};
