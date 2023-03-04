// const userData = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

const Users = require("../model/User");

const fsPromise = require("fs").promises;
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();

const handleLogout = async (req, res) => {
  //*  on client, also delete the access token

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({
      message: "No Content",
    });
  }
  const refreshToken = cookies.jwt;

  // const foundPerson = userData.users.find(
  //   (i) => i.refreshToken === refreshToken
  // );
  const foundPerson = await Users.findOne({ refreshToken }).exec();
  console.log(foundPerson, refreshToken);

  if (!foundPerson) {
    return res.clearCookie("jwt", {
      httpOnly: true,
      // secure: true,
      sameSite: "None",
    });
  }

  //* Delete refresh token in db
  // const otherUsers = userData.users.filter(
  //   (i) => i.refreshToken !== foundPerson.refreshToken
  // );
  // const currentUser = { ...foundPerson, refreshToken: "" };
  // userData.setUsers([...otherUsers, currentUser]);
  // await fsPromise.writeFile(
  //   path.join(__dirname, "..", "model", "users.json"),
  //   JSON.stringify(userData.users)
  // );

  foundPerson.refreshToken = "";
  const result = await foundPerson.save();
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  }); //* secure: true  -> only for server on https

  return res.sendStatus(204);
};

module.exports = {
  handleLogout,
};
