const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  roles: {
    User: {
      type: String,
      default: 2001,
    },
    Admin: String,
    Editor: String,
  },
  password: {
    type: String,
    require: true,
  },
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
