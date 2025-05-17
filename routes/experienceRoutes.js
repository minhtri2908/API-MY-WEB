const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');

// GET all experiences
router.get('/', async (req, res) => {
  const exp = await Experience.find();
  res.json(exp);
});

// (Optional) POST - Thêm dữ liệu
// router.post('/', async (req, res) => {
//   const newExp = new Experience(req.body);
//   await newExp.save();
//   res.status(201).json(newExp);
// });

module.exports = router;
