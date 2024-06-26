// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
//if user exists,show user exists message

UserSchema.pre("save", async function (next) {
    const user = await this.model("User").findOne({ email: this.email });
    if (user) {
      throw new Error("User already exists");
    }
    next();
  });

module.exports = mongoose.model('User', UserSchema);
