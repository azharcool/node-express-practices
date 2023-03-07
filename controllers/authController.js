require("dotenv").config();
const User = require("../model/User");
const bcrypt = require("bcrypt");
// const fsPromise = require("fs").promises;
// const path = require("path");
const jwt = require("jsonwebtoken");
// require("dotenv").config();

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res.status(400).json({
      message: "username and password are required.",
    });
  }

  console.log("auth-controller")
  // const foundPerson = userData.users.find((i) => i.username === user);
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) {
    return res.status(401).json({
      message: "unauthorized",
    });
  }

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      {
        userInfo: {
          username: foundUser.username,
          roles: Object.values(foundUser.roles),
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    //* Saving refreshtoken with current user
    // const otherUsers = userData.users.filter((i) => i.username !== user);
    // const currentUser = { ...foundPerson, refreshToken };
    // userData.setUsers([...otherUsers, currentUser]);
    // console.log(userData.users);
    // fsPromise.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"),
    //   JSON.stringify(userData.users)
    // );
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);
    // console.log(role);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true, //should comment when debug
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      roles,
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  handleLogin,
};
