const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const Image = require("../models/Image");
const router = express.Router();
const upload = multer({ dest: "uploads/" }); // upload tạm vào local
const authenticateAdmin = require("../middleware/authMiddleware");
router.post(
  "/",
  authenticateAdmin,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const files = req.files;
      const titles = req.body.titles;

      // Bước 1: Kiểm tra toàn bộ file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) {
          // Xoá toàn bộ file tạm
          files.forEach((f) => fs.existsSync(f.path) && fs.unlinkSync(f.path));
          return res.status(400).json({
            error: `Ảnh "${i + 1}" quá lớn (>10MB). Vui lòng chọn ảnh nhẹ hơn.`,
          });
        }
      }

      // Bước 2: Upload từng ảnh sau khi đã kiểm tra
      const uploadedImages = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "portfolio",
        });

        fs.unlinkSync(file.path); // Xóa file tạm

        // Xử lý tiêu đề tương ứng
        let title = "";
        if (Array.isArray(titles)) {
          title = titles[i] || "";
        } else if (typeof titles === "string" && i === 0) {
          title = titles;
        }

        const newImage = await Image.create({
          title,
          url: result.secure_url,
        });

        uploadedImages.push(newImage);
      }

      res.status(201).json(uploadedImages);
    } catch (err) {
      console.error("Upload nhiều ảnh lỗi:", err);
      res.status(500).json({ error: "Upload nhiều ảnh thất bại" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const images = await Image.find().sort({ _id: -1 }); // mới nhất trước
    res.json(images);
  } catch (err) {
    console.error("Lỗi khi lấy ảnh:", err);
    res.status(500).json({ error: "Không thể lấy ảnh" });
  }
});

module.exports = router;
