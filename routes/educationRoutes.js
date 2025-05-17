const express = require('express');
const router = express.Router();
const Education = require('../models/Education');

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
// router.post('/', async (req, res) => {
//   const newExp = new Education(req.body);
//   await newExp.save();
//   res.status(201).json(newExp);
// });


module.exports = router;
