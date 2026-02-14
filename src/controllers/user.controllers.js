import mongoose from "mongoose";
import User from "../models/user.models.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, phone_number, password } = req.body;
    if (!password)
      return res.status(400).json({ message: "Password is required" });

    const user = await User.create({ name, email, phone_number, password });

    const userSafe = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
    };

    res.status(201).json({
      message: "User created successfully",
      data: userSafe,
    });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ message: "Email already exists" });
    if (error.name === "ValidationError")
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      message: "Users fetched",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user; // set by protect middleware
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "Current user", data: user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    // validate id
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid user id" });

    // allow only specific fields to be updated
    const allowed = ["name", "email", "phone_number"];
    const filtered = {};
    Object.keys(updates).forEach((k) => {
      if (allowed.includes(k)) filtered[k] = updates[k];
    });

    if (Object.keys(filtered).length === 0)
      return res.status(400).json({ message: "No valid fields to update" });

    const user = await User.findByIdAndUpdate(id, filtered, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User updated", data: user });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ message: "Email already in use" });
    if (error.name === "ValidationError")
      return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid user id" });

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
