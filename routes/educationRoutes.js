const express = require("express");
const router = express.Router();
const Education = require("../models/Education");
const authenticateAdmin = require("../middleware/authMiddleware");

// GET /api/educations
router.get("/", async (req, res) => {
  try {
    const educations = await Education.find();
    res.json(educations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) POST - Thêm dữ liệu
router.post("/", authenticateAdmin, async (req, res) => {
  const newExp = new Education(req.body);
  await newExp.save();
  res.status(201).json(newExp);
});

// PUT /api/educations/:id - Cập nhật education
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const updatedEdu = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEdu) {
      return res.status(404).json({ message: "Không tìm thấy education" });
    }

    res.json({
      message: "Cập nhật thành công",
      data: updatedEdu,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
