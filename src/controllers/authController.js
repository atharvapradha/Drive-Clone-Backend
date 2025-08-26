// src/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/User");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({ name, email, password: hashedPassword });

    return res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { register, login };
