// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { token } = require("morgan");

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
    const token = jwt.sign({ _id: user._id,username:user.username }, process.env.SECRET, {
      expiresIn: "1d",
    });
    res
      .header("auth-token", token)
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({ message: "User created successfully", token: token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      throw new Error("User does not exist");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign({ _id: user._id ,username : user.username}, process.env.SECRET, {
      expiresIn: "1d",
    });
    res
      .header("auth-token", token)
      .cookie("token", token, { httpOnly: true })
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
});
// Refresh token route
router.get("/refresh", async (req, res) => {
  try {
    // Assuming the refresh token is stored in a cookie
    const refreshToken = res.cookies.token;
    if (!refreshToken) throw new Error("No refresh token found");

    // Verify the refresh token
    const verified = jwt.verify(refreshToken, process.env.SECRET);
    if (!verified) throw new Error("Refresh token verification failed");

    // Find the user based on the ID in the verified token
    const user = await User.findById(verified._id);
    if (!user) throw new Error("User does not exist");

    // Generate a new access token
    const newToken = jwt.sign({ _id: user._id }, process.env.SECRET, {
      expiresIn: "1d",
    });

    // Optionally, generate a new refresh token and save it in the database or send it back to the user
    // For simplicity, we're just sending the new access token here
    res
      .header("auth-token", newToken)
      .cookie("token", newToken, { httpOnly: true })
      .status(200)
      .json({ message: "Token refreshed successfully", token: newToken });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: err.message, success: false });
  }
});

router.get("/logout", async (req, res) => {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      })
      .status(200)
      .json({
        success: true,
        msg: "User logged out",
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: err,
    });
  }
});

module.exports = router;
