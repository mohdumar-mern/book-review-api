import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";

// @route   POST /api/auth/register
export const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
  res.status(201).json({
    message: "User registered successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

// @route   POST /api/auth/login
export const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

// @route   PUT /api/users/:id
// @access  Private (user can update their own name/email)
export const updateUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  // Optional: ensure the user is updating their own profile
  if (req.user._id.toString() !== id ) {
    return res.status(404).json({ message: "user not found " });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = name || user.name;
  user.email = email || user.email;

  const updatedUser = await user.save();

  res.status(200).json({
    message: "User updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  });
});

