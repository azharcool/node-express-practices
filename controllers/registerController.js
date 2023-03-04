// const userData = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
const User = require("../model/User");



// const fsPromise = require("fs").promises;
// const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res.status(400).json({
      message: "username and password are required.",
    });
  }
  //* check for duplicate usernames in the db
  // const duplicate = userData.users.find((i) => i.username === user);
  const duplicate = await User.findOne({username: user}).exec();
  console.log(duplicate)
  if (duplicate) {
    return res.sendStatus(409); //!conflict
  }

  try {
    //* encrypt the password
    const hashPwd =await bcrypt.hash(pwd, 10);
    console.log(hashPwd)

    //* store the new user
    // const newUser = { username: user, password: hashPwd };
    // userData.setUsers([...userData.users, newUser]);

    // await fsPromise.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"),
    //   JSON.stringify(userData.users)
    // );

    const result = await User.create({
      "username": user,
      "password": hashPwd
    })

    res.status(201).json({
      success: `New user ${user} created!`,
    });
  } catch (error) {
    res.status(500).json({
      "message": "not found!"
    });
  }
};

module.exports = {
  handleNewUser,
};
