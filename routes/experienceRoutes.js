const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const authenticateAdmin = require('../middleware/authMiddleware')
// GET all experiences
router.get('/', async (req, res) => {
  const exp = await Experience.find();
  res.json(exp);
});

// (Optional) POST - Thêm dữ liệu
router.post('/', authenticateAdmin , async (req, res) => {
  const newExp = new Experience(req.body);
  await newExp.save();
  res.status(201).json(newExp);
});
// update dữ liệu kinh nghiệm hiện có 
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const updated = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Experience not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating experience', error: err });
  }
});

module.exports = router;
