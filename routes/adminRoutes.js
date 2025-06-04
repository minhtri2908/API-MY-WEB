const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const authenticateAdmin = require("../middleware/authMiddleware");
const router = express.Router();
const isProduction = process.env.NODE_ENV === "production";

// login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 30 * 60 * 1000, // 30 phút
      })
      .json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// check đăng nhập
router.get("/check-auth", authenticateAdmin, (req, res) => {
  res.json({ loggedIn: true });
});
//logout
router.post("/logout", (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    })
    .json({ message: "Logged out" });
});
///tạo tk admin từ admin khác
router.post("/create-admin", authenticateAdmin, async (req, res) => {
  const { username, password } = req.body;

  // Chỉ cho phép người có role là admin tạo tài khoản mới
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      role: "admin", // đảm bảo role là admin
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Lấy thông tin công khai của admin (không cần token)
router.get("/public-profile", async (req, res) => {
  try {
    const admin = await Admin.findOne().select("name jobTitle about cvLink");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Cập nhật thông tin admin (chỉ dùng nội bộ admin - cần token nếu bạn muốn bảo vệ)
router.put("/update-profile", authenticateAdmin, async (req, res) => {
  const { name, jobTitle, about, cvLink, password } = req.body;

  try {
    const updateData = { name, jobTitle, about, cvLink };

    // Nếu có password mới, hash và thêm vào update
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedAdmin = await Admin.findOneAndUpdate(
      {}, // Lấy admin đầu tiên (vì chỉ có 1)
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin profile updated successfully", admin: updatedAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
