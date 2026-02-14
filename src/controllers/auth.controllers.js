import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

const signToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone_number } = req.body;
    if (!name || !email || !password || !phone_number) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.create({ name, email, password, phone_number });
    const token = signToken(user._id);

    // remove password from returned object (select:false prevents it anyway)
    const userSafe = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
    };

    return res
      .status(201)
      .json({ message: "User registered", data: userSafe, token });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ message: "Email or phone already exists" });
    if (error.name === "ValidationError")
      return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // need password for comparison, so explicitly select it
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id);
    const userSafe = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
    };

    return res
      .status(200)
      .json({ message: "Login successful", data: userSafe, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
