// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    //encrypt the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create a new user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
      expiresIn: "1d",
    });
    res
      .header("auth-token", token)
      .status(200)
      .json({ message: "User created successfully", token: token});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user=await User.findOne({ email });
    if(!user){
        throw new Error("User does not exist");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
      expiresIn: "1d",
    });
    res
      .header("auth-token", token)
      .status(200)
      .json({ message: "Login successful", token: token });
    } catch (err) {
      if (err.message === "User does not exist") {
        return res.status(400).json({ message: "User does not exist" });
      }
      if (err.message === "Invalid password") {
        return res.status(400).json({ message: "Invalid password" });
      }
    console.error(err.message);
    res.status(500).send("Server error");
    }
}
);

module.exports = router;
