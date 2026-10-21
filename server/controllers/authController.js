import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );
    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,

      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (name === undefined && email === undefined) {
      return res.status(400).json({
        message: "Please provide a name or email to update",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !email.trim()
      ) {
        return res.status(400).json({
          message: "Email cannot be empty",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(normalizedEmail)
      ) {
        return res.status(400).json({
          message: "Please provide a valid email",
        });
      }

      const existingUser =
        await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: user._id,
          },
        });

      if (existingUser) {
        return res.status(400).json({
          message: "Email is already in use",
        });
      }

      user.email = normalizedEmail;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error.message
    );

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email is already in use",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        message:
          "Current password and new password are required",
      });
    }

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string"
    ) {
      return res.status(400).json({
        message: "Passwords must be valid strings",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        message:
          "Current password is incorrect",
      });
    }

    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (samePassword) {
      return res.status(400).json({
        message:
          "New password must be different from your current password",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      12
    );

    await user.save();

    return res.status(200).json({
      message:
        "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};